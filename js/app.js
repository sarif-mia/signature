import { STATUS_DURATION } from "./config.js";
import { clearSettings, loadSettings, saveSettings } from "./storage.js";
import { createSignatureHtml } from "./signature.js";
import { downloadFile } from "./utils.js";

const panels = ["templates", "details", "images", "style"];
const nextLabels = ["Next: Add details", "Next: Add images", "Next: Customize style", "Copy my signature"];
const elements = {
  form: document.querySelector("#signature-form"), preview: document.querySelector("#signature-preview"), colorValue: document.querySelector("#color-value"), status: document.querySelector("#status-message"), copyButton: document.querySelector("#copy-button"), downloadButton: document.querySelector("#download-button"), resetButton: document.querySelector("#reset-button"), backButton: document.querySelector("#back-button"), nextButton: document.querySelector("#next-button"), nav: [...document.querySelectorAll(".nav-step")], formPanels: [...document.querySelectorAll(".form-panel")],
};
const defaults = readForm();
let activePanel = 0;
let statusTimer;

function readForm(){return Object.fromEntries(new FormData(elements.form).entries())}
function writeForm(settings){Object.entries(settings).forEach(([name,value])=>{const field=elements.form.elements.namedItem(name);if(field)field.value=value})}
function render(){const settings=readForm();document.documentElement.style.setProperty("--accent",settings.color);document.documentElement.style.setProperty("--accent-soft",`${settings.color}18`);elements.colorValue.value=settings.color.toUpperCase();elements.preview.innerHTML=createSignatureHtml(settings);saveSettings(settings)}
function showStatus(message,isError=false){elements.status.textContent=message;elements.status.classList.toggle("is-error",isError);clearTimeout(statusTimer);statusTimer=setTimeout(()=>{elements.status.textContent=""},STATUS_DURATION)}
function showPanel(index){activePanel=Math.max(0,Math.min(index,panels.length-1));elements.nav.forEach((button,i)=>{button.classList.toggle("is-active",i===activePanel);button.setAttribute("aria-selected",String(i===activePanel))});elements.formPanels.forEach((panel,i)=>{panel.hidden=i!==activePanel;panel.classList.toggle("is-active",i===activePanel)});elements.backButton.disabled=activePanel===0;elements.nextButton.innerHTML=`${nextLabels[activePanel]} <span aria-hidden="true">${activePanel===panels.length-1?"▣":"→"}</span>`}
async function copySignature(){const html=createSignatureHtml(readForm());try{if(window.ClipboardItem&&navigator.clipboard?.write){await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([elements.preview.innerText],{type:"text/plain"})})])}else{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(elements.preview);selection.removeAllRanges();selection.addRange(range);document.execCommand("copy");selection.removeAllRanges()}showStatus("Signature copied — it’s ready to paste.")}catch{showStatus("Copy was blocked. Select the preview and copy it manually.",true)}}
function downloadSignature(){const html=`<!doctype html><html><head><meta charset="utf-8"><title>Email Signature</title></head><body>${createSignatureHtml(readForm())}</body></html>`;downloadFile(html,"email-signature.html","text/html");showStatus("HTML file downloaded.")}
function resetBuilder(){clearSettings();writeForm(defaults);showPanel(0);render();showStatus("Builder reset to the default example.")}

elements.form.addEventListener("input",render);elements.form.addEventListener("submit",e=>e.preventDefault());elements.copyButton.addEventListener("click",copySignature);elements.downloadButton.addEventListener("click",downloadSignature);elements.resetButton.addEventListener("click",resetBuilder);elements.backButton.addEventListener("click",()=>showPanel(activePanel-1));elements.nextButton.addEventListener("click",()=>activePanel===panels.length-1?copySignature():showPanel(activePanel+1));elements.nav.forEach((button,index)=>button.addEventListener("click",()=>showPanel(index)));
const saved=loadSettings();if(saved)writeForm(saved);showPanel(0);render();
