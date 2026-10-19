(function(){
"use strict";
/* =====================================================================
   EMS TEAM HUB: CONTENT
   This is the only file you need to edit to update the site.

   - Leave a url / src as "" until you have it. The page shows
     "Link not added yet" instead of a broken button.
   - Files you upload to this project use paths that start with "/":
       audio   /assets/audio/sample-call-1.mp3
       photos  /assets/team/maria-santos.jpg
       PDFs    /assets/docs/house-rules.pdf
   - Run  npm run check  before deploying to catch typos in file paths.
   ===================================================================== */
const TOOLS = [
  { id:"leads",    name:"Agent Leads",                        group:"sales",     type:"sheet", desc:"Leads assigned to each sales agent.", url:"https://docs.google.com/spreadsheets/d/1RDiAvRJHhrueuwUzj555jq7Qrl3nhArjV-GH2JrrK2Q/edit?gid=1620293254#gid=1620293254" },
  { id:"glp",      name:"GLP1 Lists",                         group:"sales",     type:"sheet", desc:"GLP1 product lists.", url:"https://docs.google.com/spreadsheets/d/1FAUICVoqF_h1BFgfxccn6Rxh7vu9W-Cu2QtYWffwjEk/edit?gid=0#gid=0" },
  { id:"ghl",      name:"GoHighLevel",                        group:"sales",     type:"ghl",   desc:"East Med Distributors account. Opens the team inbox.", url:"https://app.gohighlevel.com/v2/location/20zxB8E6tTj5MFTSC4I0/conversations/conversations" },
  { id:"orders",   name:"Order Submission Form",              group:"orders",    type:"form",  desc:"Form for submitting a new customer order.", url:"https://docs.google.com/forms/d/e/1FAIpQLScXsNpuDQNBVg_xwZ3L2_ICYrwokZta8jBNLnqOS3-opUGzMg/viewform?pli=1&pli=1" },
  { id:"james",    name:"Order Form Responses: James",        group:"orders",    type:"sheet", desc:"Responses sheet for James's order forms.", url:"https://docs.google.com/spreadsheets/d/1eddxqD5EV_vG0Zj5ATiHuxBF-t_BPRBJj2IY_lvy6IQ/edit?pli=1&gid=1902546366#gid=1902546366" },
  { id:"payment",  name:"Payment Tracker",                    group:"orders",    type:"sheet", desc:"Customer payments and balances.", url:"https://docs.google.com/spreadsheets/d/1W3fW7Mcpekrb-ybz0k77ilUqp9BZv8HWVrmcK1EFquI/edit?pli=1&gid=8354167#gid=8354167" },
  { id:"otc",      name:"OTC Lists",                          group:"inventory", type:"sheet", desc:"Over-the-counter product lists and stock.", url:"https://docs.google.com/spreadsheets/d/1vG95EKfL8hSWTK4sNskaUvIMaqUTMcO-eYfPIEHV-Hw/edit?gid=0#gid=0" },
  { id:"bible",    name:"EMS Bible",                          group:"reference", type:"multi", desc:"The company reference guide. Same content in three formats.",
    formats:[
      { label:"Sheet", type:"sheet", url:"https://docs.google.com/spreadsheets/d/1TV6lIaL82i5NdWVGbUvORwz0gzMgNPGrI2ukM0j-L5E/edit?gid=1648675415#gid=1648675415" },
      { label:"Canva", type:"canva", url:"https://www.canva.com/design/DAHUKsE4iQ4/2g6uZ6ndDIhj5Qv_Qc3gTg/edit" },
      { label:"PDF",   type:"pdf",   url:"https://drive.google.com/file/d/1xHJ25jtRk9pafLpFW7A_Se06DZXMApJk/view?usp=sharing" }
    ] },
];
const GROUPS = [
  { id:"sales", name:"Sales and leads" },
  { id:"orders", name:"Orders and payments" },
  { id:"inventory", name:"Inventory" },
  { id:"reference", name:"Reference" }
];
const DEFAULT_PINS = ["leads","orders","payment","bible"];

const VIDEOS = [
  { title:"Cold calling for B2B sales", youtube:"https://youtu.be/17SF_CBE2Pg?si=BNmSeSNTMbZbVn84",  notes:"Watch this before your first day on the phones." }
];
const RECORDINGS = [
  { title:"Sample call 1", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 2", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 3", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" }
];

/* Org chart. Owner and Co-Owner sit side by side at the top (partner), then OM, then TM.
   photo: put each picture in /assets/team/ and set e.g. "/assets/team/roy-caringal.jpg". Leave "" until you have it.
   Addresses are intentionally not stored. */
const P=(name,role,dept,email,birthday,start,photo,extra)=>Object.assign({ name, role, dept, email, birthday, start, photo:photo||"" },extra);

const ORG = P("Robert James","Owner","Leadership","","Jan 23, 1986","","",{ origin:"Ohio",
  partner:P("Fredrick James","Co-Owner","Leadership","","Dec 28, 1990","","",{ origin:"Ohio" }),
  children:[
  P("Roy Marc Caringal","Operations Manager (OM)","Operations","roy.helpingdiabetics@gmail.com","May 31, 1989","Aug 3, 2026","",{ children:[
    P("Kareen Myles C. Barrera","Team Manager (TM)","Sales","myles.eastmedsupplies@gmail.com","Jun 26, 1988","","",{ children:[
      P("Angelus Clemeth Ablaza","Team Leader / Supervisor","Sales","angelusclemeth.helpingdiabetics@gmail.com","Nov 5, 1990","Aug 14, 2026"),
      P("Arvin Jay Romero","Team Leader","Sales","arvin.helpingdiabetics@gmail.com","Apr 11, 1998",""),
      P("Rowiel Alday","Team Leader","Sales","rex.helpingdiabetics@gmail.com","Sep 11, 1999","Aug 18, 2026")
    ]}),
    P("Jonil Abenir (Juju)","Trainer","Training","jon.helpingdiabetics@gmail.com","Nov 16, 1989","Aug 4, 2026"),
    P("Jayvee Panganiban","Secretary / QA","Admin","jayvee.helpingdiabetics@gmail.com","","Aug 5, 2026"),
    P("Lord Marco P. Ilustrisimo","FB Ads Manager","Marketing","maykotrisimo6@gmail.com","Mar 21, 1996","Aug 15, 2026")
  ]})
]});

/* Sales team. Team Leader assignments aren't set yet, so they are shown together under the Team Leaders. */
const SALES_TEAM = [
  P("Jeniel Andrew Sarmiento","Agent","Sales","andygarcia.helpingdiabetics@gmail.com","Mar 23, 1990","Sep 14, 2026"),
  P("Klydine Claire Z. Morales","Sales Agent","Sales","klydhelpingdiabetics@gmail.com","Mar 3, 1990","Aug 14, 2026"),
  P("Maria Fatima Vengco (Patch)","Sales Representative","Sales","patch.helpingdiabetics@gmail.com","Oct 12, 1991","Sep 14, 2026"),
  P("Joselito Jr Bercasio","Sales Representative","Sales","jbercasio.helpingdiabetics@gmail.com","Aug 26, 1988","Aug 6, 2026"),
  P("Edward Alexes Engbino","Sales Representative","Sales","Edward.helpingdiabetics@gmail.com","Sep 13, 1987","Aug 20, 2026"),
  P("Albert Paubsanon","Sales Representative","Sales","albert.helpingdiabetics@gmail.com","Jul 18, 1987",""),
  P("Francis Meldrin Daya","Sales Representative","Sales","francis.helpingdiabetics@gmail.com","Apr 13, 1993","Sep 14, 2026"),
  P("Angel Jan Katigbak","Sales Rep / Software Dev","Sales","angelhelpingdiabetics@gmail.com","Sep 5, 2005","Aug 17, 2026")
];

const RULES_PDF = { url:"/assets/docs/house-rules.pdf", updated:"" };   // e.g. url:"/assets/docs/house-rules.pdf", updated:"Sep 2026"
const RULE_SECTIONS = [
  { title:"Working hours and attendance", body:"[Copy this section from the house rules PDF.]" },
  { title:"Communication with clients", body:"[Copy this section from the house rules PDF.]" },
  { title:"Handling company and client data", body:"[Copy this section from the house rules PDF.]" },
  { title:"Workplace conduct", body:"[Copy this section from the house rules PDF.]" }
];

window.EMS_DATA = { TOOLS, GROUPS, DEFAULT_PINS, VIDEOS, RECORDINGS, ORG, SALES_TEAM, RULES_PDF, RULE_SECTIONS };
})();
