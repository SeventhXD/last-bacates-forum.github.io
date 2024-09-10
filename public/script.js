const postsUrl = 'http://localhost:3000/posts';
const maxPostAge = 48 * 60 * 60 * 1000; // 48 hours

let posts = [];
let displayName = 'Anonymous';
let people = [];

// Load posts from the server
function loadPosts() {
    fetch(postsUrl)
        .then(response => response.json())
        .then(data => {
            posts = data;
            cleanUpOldPosts();
            renderPosts();
        });
}

// Save posts to the server
function savePosts() {
    fetch(postsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(posts)
    });
}

// Clean up posts older than 48 hours
function cleanUpOldPosts() {
    const now = Date.now();
    posts = posts.filter(post => now - post.id < maxPostAge);
    savePosts();
}

// Set or update the display name
function setDisplayName() {
    const nameInput = document.getElementById('display-name');
    const newName = nameInput.value.trim();
    if (newName) {
        displayName = newName;
        if (!people.includes(displayName)) {
            addPerson(displayName);
        }
        nameInput.value = '';
        updatePeopleList(); // Update the list to reflect changes
    }
}

// Add a new post
function addPost() {
    const content = document.getElementById('post-content').value;
    if (content) {
        const post = {
            id: Date.now(),
            content: content,
            displayName: displayName,
            comments: [],
            timestamp: new Date().toLocaleString()
        };
        posts.push(post);
        document.getElementById('post-content').value = '';
        savePosts();
        renderPosts();
    }
}

// Add a comment to a post
function addComment(postId, commentContent) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({ content: commentContent, displayName: displayName, timestamp: new Date().toLocaleString() });
        savePosts();
        renderPosts();
    }
}

// Render posts to the page
function renderPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p><strong>${formatDisplayName(post.displayName)}:</strong> ${formatContent(post.content)}</p>
            <p><small>${post.timestamp}</small></p>
            <button onclick="showCommentForm(${post.id})">Add Comment</button>
            <div id="comments-${post.id}">
                ${post.comments.map(comment => `<div class="comment"><strong>${formatDisplayName(comment.displayName)}:</strong> ${formatContent(comment.content)} <br><small>${comment.timestamp}</small></div>`).join('')}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Format content with bold and italic
function formatContent(content) {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>');
}

// Format display name with count for "Anonymous"
function formatDisplayName(name) {
    if (name === 'Anonymous') {
        const count = people.filter(person => person.startsWith('Anonymous')).length;
        return `Anonymous (${count})`;
    }
    return name;
}

// Show the comment form
function showCommentForm(postId) {
    const comment = prompt('Enter your comment:');
    if (comment) {
        addComment(postId, comment);
    }
}

// Toggle visibility of the people list
function togglePeopleList() {
    const peopleList = document.getElementById('people-list');
    peopleList.style.display = peopleList.style.display === 'none' ? 'block' : 'none';
    updatePeopleList();
}

// Update the people list and active count
function updatePeopleList() {
    const peopleList = document.getElementById('people');
    peopleList.innerHTML = '';
    people.forEach(person => {
        const personItem = document.createElement('li');
        personItem.textContent = formatDisplayName(person);
        peopleList.appendChild(personItem);
    });
    document.getElementById('active-count').textContent = `Active Participants: ${people.length}`;
}

// Add a new person to the list
function addPerson(name) {
    if (!people.includes(name)) {
        people.push(name);
        updatePeopleList();
    }
}

// Initialize
loadPosts();
