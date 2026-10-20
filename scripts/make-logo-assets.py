# Regenerates the MIL CITY logo crops and icons from the master logo sheet.
# Usage: python3 scripts/make-logo-assets.py public/assets/brand  (edit SRC below to point at the master image)
import numpy as np, sys
from PIL import Image, ImageDraw
SRC='brand-source/milcity-logo-sheet.png'
OUT=sys.argv[1]
im=Image.open(SRC).convert('RGB')
P=10
SKY=(955,98,1425,272)   # skyline scene inside the round badge, without the ring
boxes={'stack':(21,108,818,596),'badge':(836,14,1509,624),'word':(168,646,1376,936),'cross':(644,646,866,868)}
def crop(k):
    if k=='cross':
        c=im.crop(boxes[k]); ImageDraw.Draw(c).rectangle((0,812-646,699-644-1,999),fill=(255,255,255)); return c
    x0,y0,x1,y1=boxes[k]; return im.crop((x0-P,y0-P,x1+P,y1+P))
def to_alpha(img):
    a=np.asarray(img).astype(float)
    al=np.clip((255-a).max(axis=2)/255*1.08,0,1)   # white -> transparent
    al[al<0.04]=0
    safe=np.where(al>0,al,1)[...,None]
    rgb=np.clip((a-255*(1-al[...,None]))/safe,0,255)
    return np.dstack([rgb,al*255]).astype(np.uint8)
def dark(arr):
    a=arr.astype(float); r,g,b=a[...,0],a[...,1],a[...,2]
    red=(r>g+50)&(r>b+40)
    L=0.3*r+0.59*g+0.11*b
    nl=245-L*0.55
    out=a.copy()
    for i,d in enumerate((-6,-2,5)):
        out[...,i]=np.where(red,np.minimum(255,r*1.0+[30,20,20][i]) if i==0 else a[...,i]+20,np.clip(nl+d,0,255))
    out[...,3]=a[...,3]
    return out.astype(np.uint8)
def save(arr,name,width):
    img=Image.fromarray(arr,'RGBA'); h=round(img.height*width/img.width)
    img.resize((width,h),Image.LANCZOS).save(f'{OUT}/{name}',optimize=True); return (width,h)
def save_set(arr,base,w1):
    """Logo shown at w1 CSS pixels: WebP at 1x and 2x for srcset, plus a 2x PNG fallback."""
    img=Image.fromarray(arr,'RGBA')
    for scale in (1,2):
        w=w1*scale; h=round(img.height*w/img.width)
        img.resize((w,h),Image.LANCZOS).save(f'{OUT}/{base}-{w}.webp',quality=90,method=6)
    w=w1*2; h=round(img.height*w/img.width)
    img.resize((w,h),Image.LANCZOS).save(f'{OUT}/{base}-{w}.png',optimize=True)
sizes={}
# stack: not used by the pages any more, kept for reuse
al=to_alpha(crop('stack')); sizes['stack']=save(al,'milcity-stack-light.png',480); save(dark(al),'milcity-stack-dark.png',480)
# word (top bar, shown 142 wide) and badge (404 page, shown 180 wide)
for k,w1 in (('word',142),('badge',180)):
    al=to_alpha(crop(k)); save_set(al,f'milcity-{k}-light',w1); save_set(dark(al),f'milcity-{k}-dark',w1)
# Home skyline band: the city scene from the badge, shown about 400 px wide (source is 470 px, so no 2x)
def save_scene(arr,base):
    img=Image.fromarray(arr,'RGBA')
    img.save(f'{OUT}/{base}.webp',quality=90,method=6); img.save(f'{OUT}/{base}.png',optimize=True)
scene=im.crop(SKY); sky=to_alpha(scene)
# drop the pale sky so only the buildings and bridge remain; they then sit on any background
lum=np.asarray(scene.convert('L')).astype(float)/255
sky[...,3]=(sky[...,3]*np.clip((0.78-lum-0.0)/0.30,0,1)).astype(np.uint8)
# erase the two bits of the badge ring that fall in the top corners of the crop
w_,h_=SKY[2]-SKY[0],SKY[3]-SKY[1]; m=Image.new('L',(w_,h_),255); md=ImageDraw.Draw(m)
md.polygon([(0,0),(118,0),(0,88)],fill=0); md.polygon([(w_,0),(w_-118,0),(w_,88)],fill=0)
sky[...,3]=(sky[...,3].astype(float)*np.asarray(m)/255).astype(np.uint8)
# soften the left and bottom edges so the scene melts into the tile
xs=np.clip(np.arange(w_)/(0.20*w_),0,1)[None,:]*np.clip((w_-np.arange(w_))/(0.06*w_),0,1)[None,:]
ys=np.clip((h_-np.arange(h_))/(0.16*h_),0,1)[:,None]
sky[...,3]=(sky[...,3].astype(float)*xs*ys).astype(np.uint8)
save_scene(sky,'milcity-skyline-light'); save_scene(dark(sky),'milcity-skyline-dark')
# icons: round skyline badge on white rounded square
cross=Image.fromarray(to_alpha(crop('badge')),'RGBA')
def icon(size,pad=0.08,round_=True):
    bg=Image.new('RGBA',(size,size),(0,0,0,0)); d=ImageDraw.Draw(bg)
    d.rounded_rectangle((0,0,size-1,size-1),radius=int(size*.22) if round_ else 0,fill=(255,255,255,255))
    s=int(size*(1-2*pad)); k=s/max(cross.size); c=cross.resize((round(cross.width*k),round(cross.height*k)),Image.LANCZOS); bg.alpha_composite(c,((size-c.width)//2,(size-c.height)//2)); return bg
ROOT=OUT.rsplit('/assets',1)[0]
icon(192).save(f'{ROOT}/icon-192.png',optimize=True)
icon(512).save(f'{ROOT}/icon-512.png',optimize=True)
icon(180,round_=False).convert('RGB').save(f'{ROOT}/apple-touch-icon.png',optimize=True)
icon(32,pad=.06).save(f'{ROOT}/favicon-32x32.png')
icon(48,pad=.06).save(f'{ROOT}/favicon.ico',sizes=[(16,16),(32,32),(48,48)])
# OG image 1200x630
og=Image.new('RGBA',(1200,630),(255,255,255,255)); d=ImageDraw.Draw(og)
d.rectangle((0,594,1200,630),fill=(4,28,60,255)); d.rectangle((0,586,1200,594),fill=(200,16,46,255))
w=Image.fromarray(to_alpha(crop('word')),'RGBA'); w=w.resize((980,round(w.height*980/w.width)),Image.LANCZOS)
og.alpha_composite(w,((1200-980)//2,(586-w.height)//2)); og.convert('RGB').save(f'{ROOT}/og-image.png',optimize=True)
print(sizes)
