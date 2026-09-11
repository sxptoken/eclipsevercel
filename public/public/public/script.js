async function updateDashboard() {

    try {

        const response = await fetch(
            "/api/status",
            {
                cache: "no-store"
            }
        );

        const data = await response.json();

        document.getElementById("botStatus").textContent =
            data.status === "online"
                ? "ONLINE"
                : "OFFLINE";

        document.getElementById("statusText").textContent =
            data.status === "online"
                ? "Eclipse services are responding."
                : "Eclipse services are unavailable.";

        document.getElementById("pile").textContent =
            data.pile_count ?? 0;

        document.getElementById("status").innerHTML =
            data.status === "online"
                ? "<span></span> All systems operational"
                : "<span></span> Service unavailable";

    } catch (error) {

        document.getElementById("botStatus").textContent =
            "OFFLINE";

        document.getElementById("statusText").textContent =
            "Could not connect to the Eclipse API.";

        document.getElementById("status").innerHTML =
            "<span></span> API unavailable";
    }
}

updateDashboard();

setInterval(
    updateDashboard,
    30000
);
