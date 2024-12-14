let versions = [];

function addVersion() {
    const versionInput = document.createElement("input");
    versionInput.type = "text";
    versionInput.placeholder = "Enter version";
    document.getElementById("versions-container").appendChild(versionInput);
}

document.getElementById("datapack-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();
    const latestVersion = document.getElementById("latest_version").value.trim();
    
    // Get all versions
    versions = [];
    const versionInputs = document.querySelectorAll("#versions-container input");
    versionInputs.forEach(input => {
        const version = input.value.trim();
        if (version) {
            versions.push(version);
        }
    });

    // Basic validation
    if (!name || !id || !latestVersion || versions.length === 0) {
        document.getElementById("error-message").textContent = "All fields are required!";
        return;
    } else {
        document.getElementById("error-message").textContent = "";
    }

    // Generate JSON
    const datapackJson = generateJson(name, id, latestVersion, versions);

    // Create the downloadable link
    const blob = new Blob([datapackJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    document.getElementById("download-link").href = url;
    document.getElementById("download-container").style.display = "block";
});

// Function to generate JSON structure
function generateJson(name, id, latestVersion, versions) {
    const datapackData = {
        "datapack_name": name,
        "datapack_id": id,
        "latest_version": latestVersion,
        "versions": {}
    };

    versions.forEach(version => {
        datapackData.versions[version] = {
            "zip_location": `https://packfetch.pages.dev/datapacks/get/${id}/${name}/${version}/${name}.zip`,
            "source": `https://packfetch.pages.dev/datapacks/get/${id}/${name}/sources/${version}/`
        };
    });

    return JSON.stringify([datapackData], null, 4);
}
