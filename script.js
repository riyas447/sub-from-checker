function calculateScore(fromName, subjectLine) {
    const text = (fromName + " " + subjectLine).toLowerCase();
    
    let outlook = 95;
    let yahoo = 95;
    let aol = 95;

    // High Risk Spam Triggers
    const severeTriggers = ['urgent', 'warning', '100%', 'cure', 'reverse', 'free', '$', 'trick', 'sludge', 'cement', 'dementia', 'alzheimer'];
    severeTriggers.forEach(word => {
        if (text.includes(word)) {
            outlook -= 20;
            yahoo -= 15;
            aol -= 15;
        }
    });

    // Special Symbols / Formatting
    if (/[\!\?]{2,}|>{2,}/.test(text)) {
        outlook -= 25;
        yahoo -= 20;
        aol -= 20;
    }

    // Capitalization Check
    if (subjectLine === subjectLine.toUpperCase() && subjectLine.length > 5) {
        outlook -= 30;
        yahoo -= 25;
        aol -= 25;
    }

    // Final Normalize
    outlook = Math.max(15, Math.min(98, outlook));
    yahoo = Math.max(15, Math.min(98, yahoo));
    aol = Math.max(15, Math.min(98, aol));

    const avgScore = Math.round((outlook + yahoo + aol) / 3);

    return {
        from: fromName,
        subject: subjectLine,
        outlook: outlook,
        yahoo: yahoo,
        aol: aol,
        avg: avgScore
    };
}

function analyzeBulk() {
    const fromInput = document.getElementById('bulkFrom').value.trim().split('\n').filter(line => line.trim() !== '');
    const subjectInput = document.getElementById('bulkSubject').value.trim().split('\n').filter(line => line.trim() !== '');

    if (fromInput.length === 0 || subjectInput.length === 0) {
        alert("Please enter at least one From Name and one Subject Line!");
        return;
    }

    let results = [];

    // Cross combinations check
    fromInput.forEach(fromName => {
        subjectInput.forEach(subject => {
            results.push(calculateScore(fromName.trim(), subject.trim()));
        });
    });

    // Sort by average score descending
    results.sort((a, b) => b.avg - a.avg);

    // Display Top Winner
    const winner = results[0];
    document.getElementById('bestFrom').innerText = winner.from;
    document.getElementById('bestSubject').innerText = winner.subject;
    document.getElementById('bestScore').innerText = winner.avg + "%";

    // Populate Results Table
    const tableBody = document.getElementById('resultsTable');
    tableBody.innerHTML = results.map(r => {
        const isPass = r.avg >= 80;
        return `
            <tr>
                <td>${r.from}</td>
                <td>${r.subject}</td>
                <td>${r.outlook}%</td>
                <td>${r.yahoo}%</td>
                <td>${r.aol}%</td>
                <td>
                    <span class="${isPass ? 'badge-pass' : 'badge-risk'}">
                        ${isPass ? 'High Inbox' : 'Spam Risk'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('resultsSection').style.display = 'block';
}
