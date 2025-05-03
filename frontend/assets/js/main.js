async function fetchHackathons() {
    try {
        const response = await fetch('/api/hackathons');
        if (!response.ok) throw new Error('Failed to fetch hackathons');
        return await response.json();
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        return [];
    }
}

function renderTimeline(hackathons) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    hackathons.forEach(hackathon => {
        const hackathonDiv = document.createElement('div');
        hackathonDiv.className = 'w-full max-w-2xl mb-4 bg-white p-4 rounded-lg shadow-md cursor-pointer';
        hackathonDiv.innerHTML = `
            <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                <div>
                    <h2 class="text-xl font-semibold">${hackathon.name}</h2>
                    <p class="text-gray-600">Start: ${new Date(hackathon.start_date).toUTCString()}</p>
                </div>
            </div>
            <div class="ml-8 mt-2 hidden" id="details-${hackathon.id}"></div>
        `;
        hackathonDiv.addEventListener('click', () => toggleDetails(hackathon));
        timeline.appendChild(hackathonDiv);
    });
}

async function toggleDetails(hackathon) {
    const detailsDiv = document.getElementById(`details-${hackathon.id}`);
    if (detailsDiv.classList.contains('hidden')) {
        detailsDiv.innerHTML = renderHackathonTimeline(hackathon);
        detailsDiv.classList.remove('hidden');
    } else {
        detailsDiv.classList.add('hidden');
    }
}

async function init() {
    const hackathons = await fetchHackathons();
    renderTimeline(hackathons);
    setInterval(async () => {
        const updatedHackathons = await fetchHackathons();
        renderTimeline(updatedHackathons);
    }, 60000); // Refresh every minute
}

document.addEventListener('DOMContentLoaded', init);