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

    // Create Minecraft version input field for each version
    const minecraftVersionField = document.createElement("input");
    minecraftVersionField.type = "text";
    minecraftVersionField.placeholder = "Enter Minecraft versions (comma separated)";
    minecraftVersionField.required = true;

    // Create a remove button for the version input field
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove Version";
    removeButton.onclick = () => {
        versionContainer.removeChild(versionInput);
    };

    versionInput.appendChild(versionField);
    versionInput.appendChild(minecraftVersionField);
    versionInput.appendChild(removeButton);
    versionContainer.appendChild(versionInput);
}

document.getElementById("datapack-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();
    const latestVersion = document.getElementById("latest_version").value.trim();
    const latestMinecraftCompatibility = document.getElementById("minecraft_version").value.trim().split(",").map(version => version.trim());

    // Get all versions and Minecraft compatibility versions from dynamically added fields
    versions = [];
    const versionInputs = document.querySelectorAll("#versions-container .version-input");
    versionInputs.forEach(input => {
        const version = input.querySelector("input[type='text']:first-of-type").value.trim();
        const minecraftVersions = input.querySelector("input[type='text']:last-of-type").value.trim().split(",").map(version => version.trim());

        if (version && minecraftVersions.length > 0) {
            versions.push({
                version,
                minecraftVersions
            });
        }
    });

    // Basic validation
    if (!name || !id || !latestVersion || versions.length === 0 || latestMinecraftCompatibility.length === 0) {
        document.getElementById("error-message").textContent = "All fields are required!";
        return;
    } else {
        document.getElementById("error-message").textContent = "";
    }

    // Generate JSON
    const datapackJson = generateJson(name, id, latestVersion, latestMinecraftCompatibility, versions);

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
function generateJson(name, id, latestVersion, latestMinecraftCompatibility, versions) {
    const datapackNameId = replaceSpacesWithHyphen(name);

    const datapackData = {
        "datapack_name": name,
        "datapack_name_id": datapackNameId,
        "datapack_id": id,
        "latest_version": latestVersion,
        "latest_zip_location": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/${latestVersion}/${name}.zip`,
        "latest_source": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/sources/${latestVersion}/`,
        "latest_minecraft_compatibility": latestMinecraftCompatibility,
        "versions": {}
    };

    // Loop through versions and add to the 'versions' field
    versions.forEach(({ version, minecraftVersions }) => {
        datapackData.versions[version] = {
            "zip_location": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/${version}/${name}.zip`,
            "source": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/sources/${version}/`,
            "minecraft_compatibility": minecraftVersions
        };
    });

    return JSON.stringify([datapackData], null, 4);
}
