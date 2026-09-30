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
  { id:"contacts", name:"Contact Information",                group:"reference", type:"sheet", desc:"Company and team contact details.", url:"https://docs.google.com/spreadsheets/d/1BL-ij9-TW7IOF1LcN1w5MHB9XnC4TZRHIqWRRL3HSWQ/edit?gid=0#gid=0" }
];
const GROUPS = [
  { id:"sales", name:"Sales and leads" },
  { id:"orders", name:"Orders and payments" },
  { id:"inventory", name:"Inventory" },
  { id:"reference", name:"Reference" }
];
const DEFAULT_PINS = ["leads","orders","payment","bible"];

const VIDEOS = [
  { title:"Cold calling for B2B sales", youtube:"",   /* paste the full YouTube link */ notes:"Watch this before your first day on the phones." }
];
const RECORDINGS = [
  { title:"Sample call 1", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 2", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" },
  { title:"Sample call 3", agent:"[Agent name]", src:"", notes:"[What makes this call a good example]" }
];

/* Sample structure. Replace names, roles and details when ready. photo: image URL or "". */
const ORG = { name:"[Name]", role:"Owner", dept:"Leadership", email:"", phone:"", photo:"", children:[
  { name:"[Name]", role:"Sales manager", dept:"Sales", email:"", phone:"", photo:"", children:[
    { name:"[Name]", role:"Sales agent", dept:"Sales", email:"", phone:"", photo:"" },
    { name:"[Name]", role:"Sales agent", dept:"Sales", email:"", phone:"", photo:"" },
    { name:"[Name]", role:"Sales agent", dept:"Sales", email:"", phone:"", photo:"" }
  ]},
  { name:"[Name]", role:"Operations manager", dept:"Operations", email:"", phone:"", photo:"", children:[
    { name:"[Name]", role:"Order processing", dept:"Operations", email:"", phone:"", photo:"" },
    { name:"[Name]", role:"Inventory", dept:"Operations", email:"", phone:"", photo:"" }
  ]},
  { name:"[Name]", role:"Accounting", dept:"Admin", email:"", phone:"", photo:"" }
]};

const RULES_PDF = { url:"", updated:"" };   // e.g. url:"/assets/docs/house-rules.pdf", updated:"Sep 2026"
const RULE_SECTIONS = [
  { title:"Working hours and attendance", body:"[Copy this section from the house rules PDF.]" },
  { title:"Communication with clients", body:"[Copy this section from the house rules PDF.]" },
  { title:"Handling company and client data", body:"[Copy this section from the house rules PDF.]" },
  { title:"Workplace conduct", body:"[Copy this section from the house rules PDF.]" }
];

window.EMS_DATA = { TOOLS, GROUPS, DEFAULT_PINS, VIDEOS, RECORDINGS, ORG, RULES_PDF, RULE_SECTIONS };
})();
