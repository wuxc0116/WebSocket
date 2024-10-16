
const socket = io('ws://localhost:8080');

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    
}


//Create the resource
document.getElementById('resourceForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const resourceId = document.getElementById('resourceId').value;
    const resourceName = document.getElementById('resourceName').value;

    try {
        const response = await fetch('http://localhost:8080/api/resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: resourceId, name: resourceName }),
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('resourceId').value = '';
            document.getElementById('resourceName').value = '';
            alert('Successfully add the resource.');
        } else {
            console.error('Error creating resource:', data.message || 'Unknown error');
            alert('Failed to create resource. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});


// Get all resources
document.getElementById('getAllResources').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8080/api/resources');
        const resources = await response.json();
        
        const resourceList = document.getElementById('resourceList');
        resourceList.innerHTML = ''; // Clear all previous entries
        
        for (const [id, name] of Object.entries(resources)) {
            const li = document.createElement('li');
            li.textContent = `ID: ${id}, Name: ${name}`;
            resourceList.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
    }
});

// Handle deletion of a resource
document.getElementById('deleteResource').addEventListener('click', async () => {
    const deleteId = document.getElementById('deleteId').value;

    try {
        const response = await fetch('http://localhost:8080/api/resources', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: deleteId }),
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('deleteId').value = '';
            alert('Successfully delete the resource.');
        } else {
            alert('Failed to delete resource.');
        }
    } catch (error) {
        console.error('Error deleting resource:', error);
        alert('An unexpected error occurred.');
    }
});
