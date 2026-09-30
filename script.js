function analyzeEmail() {
    const fromName = document.getElementById('fromName').value.trim();
    const subjectLine = document.getElementById('subjectLine').value.trim();
    const combined = (fromName + " " + subjectLine).toLowerCase();

    if (!fromName && !subjectLine) {
        updateScores(0, 0, 0, ["Enter a From Name and Subject Line above to see analysis."]);
        return;
    }

    let outlook = 95;
    let yahoo = 95;
    let aol = 95;
    let feedback = [];

    // Spam Triggers Analysis
    const spamWords = ['free', '$', '100%', 'guarantee', 'urgent', 'warning', 'reverse', 'cure', 'trick', 'sludge', 'cement', 'dementia', 'alzheimer'];
    spamWords.forEach(word => {
        if (combined.includes(word)) {
            outlook -= 15;
            yahoo -= 12;
            aol -= 12;
            feedback.push(`⚠️ Contains risky spam keyword: "${word}"`);
        }
    });

    // Special Characters Check
    if (/[\!\?]{2,}|>{2,}|<span style="font-family: monospace;">{2,}/.test(combined)) {
        outlook -= 20;
        yahoo -= 15;
        aol -= 15;
        feedback.push("❌ Avoid special characters like '>>', '??', '!!' - High Spam Trigger!");
    }

    // Capitalization Check
    if (subjectLine === subjectLine.toUpperCase() && subjectLine.length > 5) {
        outlook -= 25;
        yahoo -= 20;
        aol -= 20;
        feedback.push("⚠️ Avoid using ALL CAPS in Subject Line.");
    }

    // Normalize Scores
    outlook = Math.max(10, Math.min(98, outlook));
    yahoo = Math.max(10, Math.min(98, yahoo));
    aol = Math.max(10, Math.min(98, aol));

    if (feedback.length === 0) {
        feedback.push("✅ Excellent! Subject Line & From Name are clean and optimized for High Primary Inbox Placement.");
    }

    updateScores(outlook, yahoo, aol, feedback);
}

function updateScores(outlook, yahoo, aol, feedback) {
    const overall = Math.round((outlook + yahoo + aol) / 3);
    
    document.getElementById('overallScore').innerText = overall + "%";
    document.getElementById('outlookScore').innerText = outlook + "%";
    document.getElementById('yahooScore').innerText = yahoo + "%";
    document.getElementById('aolScore').innerText = aol + "%";

    document.getElementById('outlookBar').style.width = outlook + "%";
    document.getElementById('yahooBar').style.width = yahoo + "%";
    document.getElementById('aolBar').style.width = aol + "%";

    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = feedback.map(item => `<li>${item}</li>`).join('');
}