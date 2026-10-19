(function(){
"use strict";
/* =====================================================================
   MIL CITY TEAM HUB: CONTENT
   This is the only file you need to edit to update the site.

   - Leave a url / src as "" until you have it. The page shows
     "Link not added yet" instead of a broken button.
   - status:"update" marks a link as "To be updated". The link still opens.
   - primary:true gives a tool the filled navy treatment (the main action).
   - Files you upload to this project use paths that start with "/":
       audio   /assets/audio/sample-call-1.mp3
       photos  /assets/team/arvin-romero.jpg
       PDFs    /assets/docs/house-rules.pdf
   - Run  npm run check  before deploying to catch typos in file paths.
   ===================================================================== */
const TOOLS = [
  { id:"main",       name:"Main Sheet",          group:"daily",     type:"sheet", desc:"The team's main working sheet.", url:"https://docs.google.com/spreadsheets/d/1KuAKMAPSC2HKtVmTkRGNaApVZtuuDavI1xtddTs5H5U/edit?gid=0#gid=0" },
  { id:"leads",      name:"Leads Sheet",         group:"daily",     type:"sheet", desc:"Leads assigned to each sales rep.", url:"https://docs.google.com/spreadsheets/d/1RDiAvRJHhrueuwUzj555jq7Qrl3nhArjV-GH2JrrK2Q/edit?pli=1&gid=162339084#gid=162339084" },
  { id:"orders",     name:"Order Form",          group:"daily",     type:"form",  primary:true, desc:"Submit a new customer order.", url:"https://docs.google.com/forms/d/e/1FAIpQLSfFjt-080lKKjsXrrFJtkf83QBaSHJFRb2k2pdSc4fTmouYnA/viewform?usp=publish-editor" },
  { id:"ordersheet", name:"Order Sheet",         group:"daily",     type:"sheet", desc:"Every order sent through the Order Form.", url:"https://docs.google.com/spreadsheets/d/1DAV79TT13feWgCHu61CEYF4jZ8mgcyiTFH576qV__9c/edit?resourcekey=&gid=216729633#gid=216729633" },
  { id:"bible",      name:"Bible",               group:"reference", type:"sheet", desc:"The company reference guide.", url:"https://docs.google.com/spreadsheets/d/1TV6lIaL82i5NdWVGbUvORwz0gzMgNPGrI2ukM0j-L5E/edit?gid=0#gid=0" },
  { id:"otc",        name:"OTC List",            group:"reference", type:"sheet", status:"update", desc:"Over-the-counter product list.", url:"https://docs.google.com/spreadsheets/d/1vG95EKfL8hSWTK4sNskaUvIMaqUTMcO-eYfPIEHV-Hw/edit?gid=0#gid=0" },
  { id:"glp",        name:"GLP-1 List",          group:"reference", type:"sheet", status:"update", desc:"GLP-1 product list.", url:"https://docs.google.com/spreadsheets/d/1sgxvHHwXUTvatQL_d8g0iCCWUA8UjX48k1vbS3MngZQ/edit?gid=0#gid=0" },
  { id:"contacts",   name:"Contact Information", group:"team",      type:"sheet", desc:"Contact details for everyone on the team.", url:"https://docs.google.com/spreadsheets/d/1BL-ij9-TW7IOF1LcN1w5MHB9XnC4TZRHIqWRRL3HSWQ/edit?gid=0#gid=0" }
];
const GROUPS = [
  { id:"daily",     name:"Daily work" },
  { id:"reference", name:"Reference" },
  { id:"team",      name:"Team" }
];
const DEFAULT_PINS = ["main","leads","orders","ordersheet"];

const VIDEOS = [
  { title:"Cold calling for B2B sales", youtube:"https://youtu.be/17SF_CBE2Pg?si=BNmSeSNTMbZbVn84",  notes:"Watch this before your first day on the phones." }
];
const RECORDINGS = [
  { title:"Sample call 1", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 2", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 3", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" }
];

/* Org chart. Owner and Co-Owner sit side by side at the top (partner), then the OM, then the sales reps.
   P(name, role, dept, email, birthday, start, photo, extra)
   - birthday: the page shows month and day only. New entries store month and day only ("Apr 11").
   - start: "Oct 13, 2026". Anyone who started in the last 30 days gets a "New" label automatically.
   - extra: { phone:"+63 9xx xxx xxxx", designation:"..." }
   - photo: put each picture in /assets/team/ and set e.g. "/assets/team/arvin-romero.jpg". Leave "" until you have it.
   Home addresses are intentionally not stored. They stay in the Contact Information sheet. */
const P=(name,role,dept,email,birthday,start,photo,extra)=>Object.assign({ name, role, dept, email, birthday, start, photo:photo||"" },extra);

const ORG = P("Robert James","Owner","Leadership","","Jan 23, 1986","","",{ origin:"Ohio",
  partner:P("Fredrick James","Co-Owner","Leadership","","Dec 28, 1990","","",{ origin:"Ohio" }),
  children:[
    P("Arvin Jay Q. Romero","Operations Manager (OM)","Operations","arvin.helpingdiabetics@gmail.com","Apr 11","Aug 6, 2026","",{ phone:"+63 926 385 8341", designation:"Team Leader", children:[
      P("Shermalyn Salih","Sales Representative","Sales","lyn.helpingdiabetics@gmail.com","Oct 24","Oct 13, 2026","",{ phone:"+63 976 364 2286" }),
      P("John Saqlain Dela Cruz","Sales Representative","Sales","john.helpingdiabetics@gmail.com","Jan 2","Oct 13, 2026","",{ phone:"+63 945 708 9489" }),
      P("Krystal Mae Cordovilla","Sales Representative","Sales","kylie.helpingdiabetics@gmail.com","May 5","Oct 13, 2026","",{ phone:"+63 905 608 9974" }),
      P("Victor Faustin G. Munar","Sales Representative","Sales","tino.helpingdiabetics@gmail.com","Feb 15","Oct 13, 2026","",{ phone:"+63 917 128 5665" })
    ]})
  ]});

const RULES_PDF = { url:"/assets/docs/house-rules.pdf", updated:"" };   // e.g. updated:"Oct 2026"
const RULE_SECTIONS = [
  { title:"Working hours and attendance", body:"[Copy this section from the house rules PDF.]" },
  { title:"Communication with clients", body:"[Copy this section from the house rules PDF.]" },
  { title:"Handling company and client data", body:"[Copy this section from the house rules PDF.]" },
  { title:"Workplace conduct", body:"[Copy this section from the house rules PDF.]" }
];

window.MILCITY_DATA = { TOOLS, GROUPS, DEFAULT_PINS, VIDEOS, RECORDINGS, ORG, RULES_PDF, RULE_SECTIONS };
})();
