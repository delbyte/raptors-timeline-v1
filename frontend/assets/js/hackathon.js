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
        <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-2">Milestones</h3>
            <ul class="space-y-2">
                ${milestones.map(milestone => `
                    <li class="flex items-center">
                        <div class="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span class="${milestone.completed ? 'line-through text-gray-500' : ''}">${milestone.name} - ${milestone.date.toUTCString()}</span>
                        ${milestone.completed ? '<span class="ml-2 text-green-500">✓</span>' : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}