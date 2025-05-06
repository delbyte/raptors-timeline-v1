function renderHackathonTimeline(hackathon) {
    const startDate = new Date(hackathon.start_date);
    const milestones = [
        { name: 'Invitation Letters Sent', date: new Date(startDate - 1000 * 60 * 60 * 24 * 28), completed: hackathon.invitation_sent },
        { name: 'Registration Ends & Hackathon Starts', date: startDate, completed: hackathon.registration_ended },
        { name: 'Submission Deadline', date: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 3), completed: hackathon.submission_deadline },
        { name: 'Judging Period Ends', date: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 16), completed: hackathon.judging_period },
        { name: 'Thank You Letters Sent', date: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 23), completed: hackathon.thank_you_sent },
    ];

    return `
        <div class="glass-card border border-gray-700/30 p-6 rounded-xl backdrop-blur-sm">
            <h3 class="text-xl font-medium mb-4 text-gray-200">Milestones</h3>
            <ul class="space-y-4">
                ${milestones.map((milestone, index) => `
                    <li class="flex items-start group">
                        <div class="relative mt-1.5">
                            <div class="w-4 h-4 ${milestone.completed ? 'bg-accent-secondary' : 'bg-dark-600'} rounded-full timeline-dot flex-shrink-0 z-10 transition-all duration-300"></div>
                            ${index < milestones.length - 1 ? `<div class="absolute top-4 left-2 w-0.5 h-full -ml-px ${milestone.completed ? 'bg-accent-secondary/50' : 'bg-dark-600'} z-0"></div>` : ''}
                        </div>
                        <div class="ml-4 flex-grow">
                            <span class="block ${milestone.completed ? 'text-gray-400' : 'text-gray-200'} font-medium transition-colors duration-300">
                                ${milestone.name}
                            </span>
                            <span class="block text-sm text-gray-500 mt-0.5">
                                ${milestone.date.toUTCString()}
                            </span>
                        </div>
                        ${milestone.completed ? '<span class="ml-2 text-accent-secondary flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></span>' : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}