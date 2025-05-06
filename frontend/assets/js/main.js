async function fetchHackathons() {
    try {
        const response = await fetch('/api/hackathons');
        if (!response.ok) throw new Error('Failed to fetch hackathons');
        return await response.json();
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        document.getElementById('timeline').innerHTML = `
            <div class="w-full max-w-3xl glass-card rounded-xl p-6 border border-gray-700/50 text-center">
                <div class="py-8">
                    <div class="inline-block p-3 rounded-full bg-dark-700 mb-4 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p class="text-gray-400">Error loading hackathons. Please try again later.</p>
                </div>
            </div>
        `;
        return [];
    }
}

function renderTimeline(hackathons) {
    const timeline = document.getElementById('timeline');
    
    if (hackathons.length === 0) {
        timeline.innerHTML = `
            <div class="w-full max-w-3xl glass-card rounded-xl p-6 border border-gray-700/50 text-center">
                <div class="py-8">
                    <div class="inline-block p-3 rounded-full bg-dark-700 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p class="text-gray-400">No hackathons found. Add your first hackathon to get started.</p>
                </div>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = '';
    
    hackathons.forEach(hackathon => {
        const hackathonDiv = document.createElement('div');
        hackathonDiv.className = 'w-full max-w-3xl mb-6 glass-card border border-gray-700/30 p-6 rounded-xl backdrop-blur-sm hover:border-accent-secondary/50 transition-all duration-300 cursor-pointer';
        
        const startDate = new Date(hackathon.start_date);
        const now = new Date();
        const isActive = startDate <= now && now <= new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 3);
        const isPast = now > new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 23);
        
        let statusBadge = '';
        if (isActive) {
            statusBadge = `<span class="ml-2 px-2 py-1 text-xs rounded-full bg-accent-secondary/20 text-accent-secondary">Active</span>`;
        } else if (isPast) {
            statusBadge = `<span class="ml-2 px-2 py-1 text-xs rounded-full bg-gray-700/30 text-gray-400">Completed</span>`;
        } else {
            statusBadge = `<span class="ml-2 px-2 py-1 text-xs rounded-full bg-dark-700 text-gray-400">Upcoming</span>`;
        }
        
        hackathonDiv.innerHTML = `
            <div class="flex items-center">
                <div class="w-4 h-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mr-4 timeline-dot"></div>
                <div class="flex-grow">
                    <div class="flex items-center">
                        <h2 class="text-xl font-semibold text-gray-200">${hackathon.name}</h2>
                        ${statusBadge}
                    </div>
                    <p class="text-gray-500 text-sm mt-1">Start: ${startDate.toUTCString()}</p>
                </div>
                <div class="text-gray-400 transform transition-transform duration-300" id="chevron-${hackathon.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="ml-8 mt-4 hidden overflow-hidden transition-all duration-300" id="details-${hackathon.id}"></div>
        `;
        
        hackathonDiv.addEventListener('click', () => toggleDetails(hackathon));
        timeline.appendChild(hackathonDiv);
    });
}

async function toggleDetails(hackathon) {
    const detailsDiv = document.getElementById(`details-${hackathon.id}`);
    const chevronIcon = document.getElementById(`chevron-${hackathon.id}`);
    
    if (detailsDiv.classList.contains('hidden')) {
        detailsDiv.innerHTML = renderHackathonTimeline(hackathon);
        detailsDiv.classList.remove('hidden');
        chevronIcon.classList.add('rotate-180');
    } else {
        detailsDiv.classList.add('hidden');
        chevronIcon.classList.remove('rotate-180');
    }
}

async function init() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = `
        <div class="w-full max-w-3xl glass-card rounded-xl p-6 border border-gray-700/50 text-center">
            <div class="py-8">
                <div class="inline-block p-3 rounded-full bg-dark-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-secondary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <p class="text-gray-400">Loading hackathon timeline...</p>
            </div>
        </div>
    `;
    
    const hackathons = await fetchHackathons();
    renderTimeline(hackathons);
    
    // Refresh every minute
    setInterval(async () => {
        const updatedHackathons = await fetchHackathons();
        renderTimeline(updatedHackathons);
    }, 60000);
}

document.addEventListener('DOMContentLoaded', init);