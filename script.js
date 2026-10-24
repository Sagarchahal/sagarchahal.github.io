/* AgentBiz AI — beginner-friendly hackathon prototype
   This version uses local templates and browser storage only. It does not call an AI API,
   run a server, collect payments, or generate real revenue. */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const STORAGE_KEY = "agentbizai-demo-v2";

const seedState = {
  orders: [
    { id: "AB-1042", customer: "Jordan Lee", initials: "JL", service: "Portfolio Copy Kit", price: 19, status: "Completed", brief: "Create concise portfolio copy for a junior frontend developer.", output: null },
    { id: "AB-1041", customer: "Taylor Morgan", initials: "TM", service: "Landing Page Starter", price: 49, status: "Processing", brief: "Draft a landing page outline for a small design studio.", output: null }
  ],
  baseOrders: 12, workflows: 38, sampleValue: 480, nextId: 1043, lastOutput: null
};
const servicePrices = { "Portfolio Copy Kit": 19, "Landing Page Starter": 49, "Project Showcase Pack": 29 };
let state = loadState();
let workflowBusy = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.orders)) return { ...structuredClone(seedState), ...saved };
  } catch (_) { /* storage may be disabled; continue in memory */ }
  return structuredClone(seedState);
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* app still works for this tab */ }
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function initials(name) {
  return String(name).trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "TC";
}
function renderOrders(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = state.orders.map(order => {
    const statusClass = order.status === "Completed" ? "completed" : order.status === "Processing" ? "processing" : "";
    return `<tr>
      <td><span class="order-id">#${escapeHTML(order.id)}</span></td>
      <td><div class="customer-cell"><span class="mini-avatar">${escapeHTML(order.initials)}</span>${escapeHTML(order.customer)}</div></td>
      <td>${escapeHTML(order.service)}</td>
      <td><span class="status-pill ${statusClass}">${escapeHTML(order.status)}</span></td>
      <td class="value-cell">$${Number(order.price).toFixed(2)}</td>
      <td><button class="row-action" data-run-order="${escapeHTML(order.id)}">${order.status === "Completed" ? "View ↗" : "Run ↗"}</button></td>
    </tr>`;
  }).join("");
}
function renderStats() {
  const processed = state.baseOrders + Math.max(0, state.orders.length - 2);
  const demoValue = state.sampleValue + state.orders.slice(2).reduce((sum, order) => sum + Number(order.price || 0), 0);
  if ($("#statOrders")) $("#statOrders").textContent = processed;
  if ($("#statRevenue")) $("#statRevenue").textContent = `$${demoValue.toFixed(2)}`;
  if ($("#statTasks")) $("#statTasks").textContent = state.workflows;
  if ($("#reportValue")) $("#reportValue").textContent = `$${demoValue.toFixed(2)}`;
  if ($("#reportWorkflows")) $("#reportWorkflows").textContent = state.workflows;
  if ($("#reportCosts")) $("#reportCosts").textContent = `$${(demoValue * .2).toFixed(2)}`;
  if ($("#reportMargin")) $("#reportMargin").textContent = "80%";
  if ($("#orderNavCount")) $("#orderNavCount").textContent = state.orders.length;
}
function renderAll() { renderOrders("ordersTable"); renderOrders("ordersTableFull"); renderStats(); saveState(); }
function toast(message) {
  const el = $("#toast"); if (!el) return;
  el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 3000);
}
function setView(name) {
  $$(".view").forEach(view => view.classList.toggle("active", view.id === `view-${name}`));
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  const label = ({ overview: "Overview", orders: "Orders", agents: "AI agents", services: "Services", checkout: "Client checkout", reports: "Reports" })[name] || "Overview";
  if ($("#breadcrumbTitle")) $("#breadcrumbTitle").textContent = label;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openOrderDialog(service = "Portfolio Copy Kit") {
  $("#serviceSelect").value = service;
  $("#orderDialog").showModal();
  setTimeout(() => $("#customerName").focus(), 50);
}
function createOrder(customer, service, brief) {
  const order = { id: `AB-${state.nextId++}`, customer, initials: initials(customer), service, price: servicePrices[service] || 19, status: "New", brief, output: null };
  state.orders.unshift(order); renderAll(); $("#orderDialog").close(); $("#orderForm").reset(); $("#serviceSelect").value = service;
  setView("orders"); toast(`Test order #${order.id} created. No payment collected.`); return order;
}
function makeDeliverable(order) {
  const brief = order.brief.trim();
  const name = order.customer.trim();
  if (order.service === "Portfolio Copy Kit") return `${name} — Portfolio Copy Kit\n\nPOSITIONING\nA concise, credible portfolio that makes the owner's strongest skills and projects easy to understand.\n\nHERO HEADLINE\nBuilding thoughtful digital experiences, one project at a time.\n\nINTRODUCTION\nI enjoy turning ideas into clear, useful web experiences. I focus on clean interfaces, accessible layouts, and reliable implementation.\n\nABOUT SECTION\nI am a curious, detail-oriented developer who learns quickly and values clear communication. I like breaking complex tasks into manageable steps and improving work through feedback.\n\nPROJECT TEMPLATE\nProject: [Project name]\nProblem: [What needed to improve]\nApproach: [Your role, tools, and decisions]\nOutcome: [Verified result or what you learned]\n\nCUSTOMER BRIEF\n${brief}\n\nQUALITY CHECK\n• Replace bracketed placeholders with true details.\n• Add only skills you can demonstrate.\n• Ask the customer to approve the copy before publishing.`;
  if (order.service === "Landing Page Starter") return `${name} — Landing Page Starter\n\nPROJECT GOAL\nTurn the visitor's first impression into a clear next step.\n\nHERO SECTION\nHeadline: A simpler way to get [customer outcome].\nSubheadline: [One sentence explaining the service, audience, and main benefit.]\nPrimary CTA: Get started\nSecondary CTA: See how it works\n\nPAGE STRUCTURE\n1. Hero: audience, value proposition, and one primary action.\n2. Problem: describe the visitor's real pain point.\n3. Solution: explain the service in three plain-language benefits.\n4. How it works: show three simple steps.\n5. Proof: use verified testimonials, examples, or measurable results only.\n6. FAQ: answer price, timing, fit, and support questions.\n7. Final CTA: repeat the next step and provide contact details.\n\nCUSTOMER BRIEF\n${brief}\n\nQUALITY CHECK\n• Confirm audience and CTA with the customer.\n• Test mobile layout, links, contrast, and form validation.\n• Do not publish unverified claims or fake testimonials.`;
  return `${name} — Project Showcase Pack\n\nPROJECT SUMMARY\n[Project name] helps [target audience] address [specific problem] through [solution].\n\nCASE STUDY OUTLINE\n1. Context: what the project is and who it serves.\n2. Challenge: the specific user or business problem.\n3. Role: what the owner personally contributed.\n4. Process: research, design decisions, implementation, and testing.\n5. Outcome: verified results, demo evidence, or lessons learned.\n6. Next iteration: what would be improved with more time.\n\nDEMO CHECKLIST\n• Prepare a 60–90 second walkthrough.\n• Show the problem, the main workflow, and the result.\n• Include screenshots or a live demo link.\n• Clearly label prototype functionality and known limitations.\n\nCUSTOMER BRIEF\n${brief}\n\nQUALITY CHECK\nUse accurate details; distinguish planned features from completed features.`;
}
function qualityChecks(order) {
  const checks = [
    ["Customer brief captured", order.brief.trim().length >= 12],
    ["Deliverable contains required sections", Boolean(order.output?.content && order.output.content.includes("QUALITY CHECK"))],
    ["Claims and placeholders flagged for human review", true],
    ["Customer approval required before delivery", true]
  ];
  return checks;
}
function renderOutput(order, stages, completed = false) {
  const output = $("#runOutput"); output.classList.remove("hidden");
  const stageHTML = stages.map(s => `<li>${escapeHTML(s)}</li>`).join("");
  if (!completed) {
    output.innerHTML = `<h3>Workflow activity · ${escapeHTML(order.id)}</h3><ul>${stageHTML}</ul><p class="workflow-note">Local workflow simulation — no external AI call.</p>`;
    return;
  }
  const checks = qualityChecks(order).map(([label, passed]) => `<li>${passed ? "✓" : "!"} ${escapeHTML(label)}</li>`).join("");
  output.innerHTML = `<h3>Workflow completed · ${escapeHTML(order.id)}</h3><ul>${stageHTML}</ul><h3>Quality checks</h3><ul>${checks}</ul><p><strong>Draft deliverable:</strong></p><pre>${escapeHTML(order.output.content)}</pre><div class="output-actions"><button class="secondary-btn" data-download-order="${escapeHTML(order.id)}">Download deliverable (.txt)</button></div><p class="workflow-note">Created from local templates, not a live AI model. Review and approve before customer use.</p>`;
}
function runAgentWorkflow(orderId = null) {
  if (workflowBusy) return;
  const order = orderId ? state.orders.find(item => item.id === orderId) : state.orders.find(item => item.status !== "Completed");
  const message = $("#workflowMessage");
  if (!order) { toast("No pending sample orders. Create a test order first."); return; }
  if (order.status === "Completed" && order.output) {
    renderOutput(order, order.output.stages || ["Previously completed local demo workflow."], true); setView("overview"); return;
  }
  workflowBusy = true; order.status = "Processing"; renderAll();
  if (message) message.textContent = `Running local demo workflow for ${order.id}…`;
  const button = $("#runWorkflowBtn"); if (button) { button.disabled = true; button.textContent = "Running…"; }
  const stages = [
    "Intake Agent: customer brief captured and scope summarized.",
    `Creation Agent: ${order.service} draft assembled from local templates.`,
    "Quality Agent: required sections checked; claims and placeholders flagged.",
    "Business Agent: demo order status updated; illustrative value logged."
  ];
  let index = 0;
  const advance = () => {
    if (index < stages.length) { renderOutput(order, stages.slice(0, index + 1)); index++; setTimeout(advance, 480); return; }
    order.output = { title: order.service, content: makeDeliverable(order), stages };
    order.status = "Completed"; state.workflows++; state.lastOutput = order.output;
    if (message) message.textContent = `Demo workflow completed for ${order.id}.`;
    workflowBusy = false; if (button) { button.disabled = false; button.innerHTML = 'Run sample workflow <span>→</span>'; }
    renderOutput(order, stages, true); renderAll(); toast("Demo workflow completed. Review the deliverable before use.");
  };
  advance();
}
function downloadDeliverable(orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order?.output?.content) { toast("Run the workflow first to create a deliverable."); return; }
  const blob = new Blob([`${order.output.title}\nOrder: ${order.id}\nStatus: ${order.status}\n\n${order.output.content}\n\n---\nGenerated by AgentBiz AI prototype. Local template output; not an external AI result.\n`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob); const link = document.createElement("a");
  link.href = url; link.download = `${order.id}-${order.service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  toast("Deliverable downloaded. Check it before sharing.");
}

$$(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
$$("[data-open]").forEach(button => button.addEventListener("click", () => setView(button.dataset.open)));
$("#newOrderBtn")?.addEventListener("click", () => openOrderDialog());
$("#newOrderBtn2")?.addEventListener("click", () => openOrderDialog());
$("#closeDialog")?.addEventListener("click", () => $("#orderDialog").close());
$("#cancelDialog")?.addEventListener("click", () => $("#orderDialog").close());
$("#orderForm")?.addEventListener("submit", event => {
  event.preventDefault(); const customer = $("#customerName").value.trim(); const service = $("#serviceSelect").value; const brief = $("#brief").value.trim();
  if (!customer || !brief) { toast("Please fill in the customer name and brief."); return; }
  createOrder(customer, service, brief);
});
$$(".order-service").forEach(button => button.addEventListener("click", () => openOrderDialog(button.dataset.service)));
$("#runWorkflowBtn")?.addEventListener("click", () => runAgentWorkflow());
document.addEventListener("click", event => {
  const runButton = event.target.closest("[data-run-order]");
  if (runButton) { const order = state.orders.find(item => item.id === runButton.dataset.runOrder); if (order?.status === "Completed" && order.output) { renderOutput(order, order.output.stages || [], true); setView("overview"); } else { setView("overview"); runAgentWorkflow(runButton.dataset.runOrder); } }
  const downloadButton = event.target.closest("[data-download-order]"); if (downloadButton) downloadDeliverable(downloadButton.dataset.downloadOrder);
});
$("#dismissBanner")?.addEventListener("click", () => $(".demo-banner")?.classList.add("hidden"));
$("#helpBtn")?.addEventListener("click", () => alert("AgentBiz AI is a hackathon prototype. It runs four role-based steps using local JavaScript templates and stores demo records in this browser. It does not connect to an AI model, server, real customer, or payment provider. Demo values are not real revenue."));
renderAll();

// Customer order + payment sandbox. This intentionally never processes real money.
let pendingClientOrder = null;
const clientPriceMap = { "Portfolio Copy Kit": 19, "Landing Page Starter": 49, "Project Showcase Pack": 29 };
function updateClientCheckoutSummary(order) {
  const summary = $("#clientCheckoutSummary");
  const button = $("#simulatePaymentBtn");
  if (!summary || !button) return;
  summary.innerHTML = `<h3>Review your request</h3><p><strong>Service:</strong> ${escapeHTML(order.service)}</p><p><strong>Customer:</strong> ${escapeHTML(order.customer)}</p><p><strong>Business:</strong> ${escapeHTML(order.businessType)}</p><p><strong>Request:</strong> ${escapeHTML(order.brief)}</p><p class="summary-total">Demo price: $${Number(order.price).toFixed(2)}</p><p class="workflow-note">This is a sample quote only. Final scope and price require human confirmation.</p>`;
  button.disabled = false;
}
$("#clientOrderForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const customer = $("#clientName").value.trim();
  const email = $("#clientEmail").value.trim();
  const businessType = $("#clientBusiness").value.trim();
  const service = $("#clientService").value;
  const brief = $("#clientBrief").value.trim();
  if (!customer || !email || !businessType || brief.length < 12) {
    toast("Complete all fields and provide a brief of at least 12 characters.");
    return;
  }
  pendingClientOrder = {
    id: `AB-${state.nextId++}`, customer, email, businessType, service,
    price: clientPriceMap[service] || 19, brief, paymentStatus: "NOT PAID — AWAITING DEMO CHECKOUT",
    status: "Awaiting review", output: null, createdAt: new Date().toISOString(), source: "client checkout sandbox"
  };
  updateClientCheckoutSummary(pendingClientOrder);
  $("#paymentResult")?.classList.add("hidden");
  toast("Demo order summary created. No payment has been taken.");
});
$("#simulatePaymentBtn")?.addEventListener("click", () => {
  if (!pendingClientOrder) { toast("Create an order summary first."); return; }
  pendingClientOrder.paymentStatus = "SIMULATED ONLY — NOT PAID";
  pendingClientOrder.status = "Awaiting human review";
  pendingClientOrder.paymentEvent = {
    type: "sandbox_simulation", result: "success_simulated_not_paid",
    note: "No provider contacted; no card data collected; no funds moved.",
    timestamp: new Date().toISOString()
  };
  state.orders.unshift({ ...pendingClientOrder, initials: initials(pendingClientOrder.customer) });
  renderAll();
  const result = $("#paymentResult");
  if (result) {
    result.innerHTML = `<strong>Sandbox event recorded: ${escapeHTML(pendingClientOrder.id)}</strong><p>Payment status: <b>SIMULATED ONLY — NOT PAID</b></p><p>No real charge occurred. The order is saved locally and still needs a human to review the brief, confirm scope and deliver the work.</p>`;
    result.classList.remove("hidden");
  }
  $("#simulatePaymentBtn").disabled = true;
  toast("Simulation recorded. This is not a real payment or revenue.");
});
