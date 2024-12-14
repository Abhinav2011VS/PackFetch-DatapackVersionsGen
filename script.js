document.getElementById("datapack-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();
    const latestVersion = document.getElementById("latest_version").value.trim();
    const latestMinecraftCompatibility = document.getElementById("minecraft_version").value.trim().split(",").map(version => version.trim());

    // Basic validation
    if (!name || !id || !latestVersion || latestMinecraftCompatibility.length === 0) {
        document.getElementById("error-message").textContent = "All fields are required!";
        return;
    } else {
        document.getElementById("error-message").textContent = "";
    }

    // Generate JSON
    const datapackJson = generateJson(name, id, latestVersion, latestMinecraftCompatibility);

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
function generateJson(name, id, latestVersion, latestMinecraftCompatibility) {
    const datapackNameId = replaceSpacesWithHyphen(name);

    const datapackData = {
        "datapack_name": name,
        "datapack_name_id": datapackNameId,
        "datapack_id": id,
        "latest_version": latestVersion,
        "latest_zip_location": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/${latestVersion}/${name}.zip`,
        "latest_source": `https://packfetch.pages.dev/datapacks/get/${id}/${datapackNameId}/sources/${latestVersion}/`,
        "latest_minecraft_compatibility": latestMinecraftCompatibility
    };

    return JSON.stringify([datapackData], null, 4);
}
