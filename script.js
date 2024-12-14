let versions = [];

function addVersion() {
    const versionContainer = document.getElementById("versions-container");

    // Create a new version input field dynamically
    const versionInput = document.createElement("div");
    versionInput.classList.add("version-input");

    const versionField = document.createElement("input");
    versionField.type = "text";
    versionField.placeholder = "Enter version";
    versionField.required = true;

    // Create a remove button for the version input field
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove Version";
    removeButton.onclick = () => {
        versionContainer.removeChild(versionInput);
    };

    versionInput.appendChild(versionField);
    versionInput.appendChild(removeButton);
    versionContainer.appendChild(versionInput);
}

document.getElementById("datapack-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();
    const latestVersion = document.getElementById("latest_version").value.trim();
    
    // Get all versions from dynamically added fields
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

// Function to replace spaces with hyphens
function replaceSpacesWithHyphen(text) {
    return text.replace(/\s+/g, '-');
}

// Function to generate JSON structure
function generateJson(name, id, latestVersion, versions) {
    const datapackData = {
        "datapack_name": name,
        "datapack_name_id": replaceSpacesWithHyphen(name), // Only name, spaces replaced with hyphen
        "datapack_id": id,
        "latest_version": latestVersion,
        "versions": {}
    };

    // Use datapack ID and name for URLs, replacing spaces with hyphens for the name
    const datapackNameId = replaceSpacesWithHyphen(name);

    versions.forEach(version => {
        datapackData.versions[version] = {
            "zip_location": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/${version}/${name}.zip`,
            "source": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/sources/${version}/`
        };
    });

    return JSON.stringify([datapackData], null, 4);
}
