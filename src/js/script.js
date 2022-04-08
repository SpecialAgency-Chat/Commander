const ipcRenderer = window.electron.ipcRenderer;
const prettier = window.dPrettier();
ipcRenderer.on = window.ipcon();
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  preventDuplicates: false,
  showDuration: "300",
  hideDuration: "7000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "swing",
  showMethod: "slideDown",
  hideMethod: "hide",
};

/** 
 * @param {string} json
 * @returns {string}
 */
function convertCode(json) {
/*  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }*/
  const code = `const { Client, ClientApplication } = require("discord.js");
(async () => {
  const client = new Client({ intents: 0 });
  client.token = "%YOUR_TOKEN%";
  client.application = new ClientApplication(client, {});
  await client.application.fetch();
  await client.application.commands.set(%COMMAND%, %GUILD%);
  console.log("Done");
})();`.replace(/%COMMAND%/g, json).replace(/%GUILD%/g, $("input#guild_id").val() ? `"${$("input#guild_id").val()}"` : "").replace(/%YOUR_TOKEN%/g, $("input#token").val());
  try {
    return prettier.format(code, { parser: "babel" });
  } catch (e) {
    return false;
  }
}

const reload = () => {
  const code = convertCode($("textarea#json").val());
  if (code) {
    $("textarea#result").val(code);
  }
}

$("textarea#json").on("keyup", reload);

$("#make").on("click", () => {
  const code = convertCode($("textarea#json").val());
  if (code) {
    $("textarea#result").val(code);
    toastr.success("Done!");
  } else {
    toastr.error("Invalid JSON");
  }
});

$("input[type=tel], input[type=text]").on("keyup", reload);

$("#run").on("click", () => {
  toastr.info("Running...");
  const r = ipcRenderer.sendSync("run", [$("textarea#result").val()]);
  if (r === "run_success") toastr.success("Done!"); else toastr.error(r);
})