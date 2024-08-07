// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const express = require('express');
const bodyParser = require('body-parser');
const { ROLLUP_SERVER } = require('./config');
const { hexToString } = require('./utils');
const { NoteController } = require('./noteController');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

async function handle_advance(data) {
  const rawPayload = hexToString(data.payload);
  const payload = JSON.parse(rawPayload);

  const metadata = data.metadata;
  const sender = metadata.msg_sender;

  switch (payload.action) {
    case "create":
      return await NoteController.createNoteAction(sender, payload.data);
    case "delete":
      return await NoteController.deleteNoteAction(sender, payload.data);
    case "update":
      return await NoteController.updateNoteAction(sender, payload.data);
    default:
      return { status: "error", message: "Invalid Action" };
  }
}

async function handle_inspect(data) {
  const urlParams = hexToString(data.payload);
  const [route, id] = urlParams.split("/");

  if (route === "all") {
    return await NoteController.getAllNotes();
  } else if (route === "id") {
    return await NoteController.getNoteById(parseInt(id, 10));
  } else {
    return { status: "error", message: "Invalid Route" };
  }
}

const handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

(async () => {
  while (true) {
    const finish_req = await fetch(`${ROLLUP_SERVER}/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accept" }),
    });

    if (finish_req.status === 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      const handler = handlers[rollup_req.request_type];
      const finish_status = await handler(rollup_req.data);
      await fetch(`${ROLLUP_SERVER}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finish_status),
      });
    }
  }
})();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
