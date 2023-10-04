import { registerPlugin, InputElement } from "@pexip/plugin-api";
//Note: Genesys must be configured for x-header processing

let genesysSIPAddress = "+6110001@au.pextest.com.byoc.mypurecloud.com.au"; //Specific Genesys Instance
let genesysAgent;
let genesysAgentDomainSuffix = ";encoding=ascii";
let genesysDialer;
let genesysDial = false;
let conferenceAlias;
let selfName;

const plugin = await registerPlugin({
  id: "genesys-integration-plugin",
  version: 1.0,
});

//Get URL paramaters first before they are destroyed
getUrlParams();

await plugin.ui.showToast({
  message: "Pexip Genesys integration plugin 🖖🏼",
});

await plugin.events.authenticatedWithConference.add((alias) => {
  //Get the Pexip Meeting Alias
  conferenceAlias = alias.conferenceAlias;
});

await plugin.events.me.addOnce((self) => {
  //console.log("Self: ", self);
  selfName = self.participant.uri; //Get Users Name
  if (genesysDial === true) {
    //Dial Genesys if ?agent=XXXX is present
    dialGenesys();
  }
});

await plugin.events.connected.add((connected) => {
  //console.log("Is connected!");
});

await plugin.events.layoutUpdate.add((layout) => {
  //console.log("Layout: ", layout);
});

await plugin.events.conferenceStatus.add((conference) => {
  //console.log("Conference Status: ", conference);
});

await plugin.events.participants.add((roster) => {
  //console.log("Participants:", roster);
});

async function getUrlParams() {
  try {
    if (new URL(parent.location.href).searchParams.get("agent")) {
      genesysAgent = new URL(parent.location.href).searchParams.get("agent");

      console.log("Genesys SIP Address:", genesysSIPAddress);
      console.log("Genesys Agent:", genesysAgent);

      genesysDial = true;
    }
  } catch (error) {
    console.log("Get URL Params Error:", error);
    genesysDial = false;
  }
}

async function dialGenesys() {
  genesysDialer = {
    path: "dial",
    method: "POST",
    payload: {
      destination: genesysSIPAddress,
      role: "GUEST",
      protocol: "auto",
      call_type: "audio",
      remote_display_name: selfName + " (SIP)",
      source_display_name: conferenceAlias,
      keep_conference_alive: "keep_conference_alive_never",
      custom_sip_headers: {
        "x-User-To-User":
          genesysAgent + "," + selfName + genesysAgentDomainSuffix,
      },
    },
  };

  console.log("Genesys Dialer request ->:", genesysDialer);
  let dialer = await plugin.conference.sendRequest(genesysDialer);
  console.log("Genesys Dialer response ->: ", dialer);
  await plugin.ui.showToast({
    message: `Connecting to agent: ` + genesysAgent,
  });
}
