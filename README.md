# Pexip Genesys Integration - WebApp3 Plugin

Pexip-Genesys Integration WebApp3 Plugin for direct calling to Genesys Agent with CustomerName (CLID) Interaction presentation

Setup:
1. Configure Genesys-Pexip Integration

2. Specify the required GenesysSIP Server in index.ts

3. Build with Yarn

4. Deploy WebApp3 Plugin
  
5. Test by connecting to Genesys Agent with a preconfigured weblink of format;
   ->  https://PexipInfinity/branding/m/vmr/express?agent=agentname@domain.com

Note: Must be deployed as IFrame\CORS will block URL Search Params unless running within the same domain


How it works:
1. Get the  URL Search parameters to obtain the agentID from ?agent=xxxx
2. Get the customer (self) alias on connection via Pexip API
3. Create the custom SIP X-header with agendID & alias ensring the encoding is ASCII as default Genesys encosing is Hex
4. On Meeting connection dial-out to Genesys queue with custom SIP header using Pexip API
5. Genesys connects and call is routed to agent with calling name of Customer (in Interaction)
6. Agent escalates to video using the standard Pexip-Genesys Cloud Interaction Widget
