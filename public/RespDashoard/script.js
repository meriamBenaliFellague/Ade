const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			if (i && i.parentElement) {
    i.parentElement.classList.remove('active');
}

		})
		li.classList.add('active');
	})
});

// TEAM SEARCH IN NAVBAR
const navbarSearchInput = document.querySelector('#content nav form input[type="search"]');
const teamSection = document.getElementById('team-section');
const teamMembersGrid = document.getElementById('team-members-grid');
if (navbarSearchInput && teamSection && teamMembersGrid) {
    navbarSearchInput.addEventListener('input', function() {
        if (teamSection.style.display !== 'none') {
            const searchTerm = this.value.toLowerCase();
            const members = teamMembersGrid.querySelectorAll('.member-card');
            members.forEach(card => {
                const name = card.querySelector('h4').textContent.toLowerCase();
                card.style.display = name.includes(searchTerm) ? '' : 'none';
            });
        }
    });
    // Reset filter when input cleared or section switched
    document.addEventListener('click', function() {
        if (teamSection.style.display !== 'none' && navbarSearchInput.value === '') {
            const members = teamMembersGrid.querySelectorAll('.member-card');
            members.forEach(card => card.style.display = '');
        }
    });
}

// DASHBOARD REFRESH FUNCTIONALITY
const refreshBtn = document.getElementById('refresh-reclamation');
if (refreshBtn) {
    refreshBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // إعادة تحميل الصفحة لتحديث البيانات
        window.location.reload();
    });
}

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// Message functionality
document.addEventListener('DOMContentLoaded', function() {
	const messageRows = document.querySelectorAll('.message-row');
	const messageModal = document.getElementById('message-modal');
	const messageModalBody = document.getElementById('message-modal-body');
	const closeMessageModal = document.getElementById('close-message-modal');
	const messagesLink = document.getElementById('messages-link');
	const messagesSection = document.getElementById('messages-section');
	const dashboardLink = document.getElementById('dashboard-link');
	const mainContent = document.querySelector('main');
	const replyModal = document.getElementById('reply-modal');
	const closeReplyModal = document.getElementById('close-reply-modal');
	const sendReplyBtn = document.getElementById('send-reply');
	const replyToInput = document.getElementById('reply-to');
	const replySubjectInput = document.getElementById('reply-subject');
	const replyMessageInput = document.getElementById('reply-message');

	// Show messages section when clicking on Messages link
	messagesLink.addEventListener('click', function(e) {
    e.preventDefault();
	
    hideAllSections();
    document.getElementById('messages-section').style.display = 'block';
    document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
        item.classList.remove('active');
    });
    this.parentElement.classList.add('active');
});

	// Show dashboard when clicking on Dashboard link
dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    // Show dashboard main sections
    document.querySelectorAll('main > .head-title, main > .box-info, main > .table-data').forEach(el => {
        el.style.display = '';
    });
    // Sidebar active state
    document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
        item.classList.remove('active');
    });
    this.parentElement.classList.add('active');
});

	// Handle message row clicks
	messageRows.forEach(row => {
		row.addEventListener('click', function() {
			const message = this.getAttribute('data-message');
			messageModalBody.textContent = message;
			messageModal.style.display = 'flex';
		});
	});

	// Close message modal
	closeMessageModal.addEventListener('click', function() {
		messageModal.style.display = 'none';
	});

	// Close reply modal
	closeReplyModal.addEventListener('click', function() {
		replyModal.style.display = 'none';
	});

	// Send reply
	sendReplyBtn.addEventListener('click', function() {
		const to = replyToInput.value;
		const subject = replySubjectInput.value;
		const message = replyMessageInput.value;

		if (subject && message) {
			// Here you would typically send the reply to your backend
			alert('Reply sent successfully!');
			replyModal.style.display = 'none';
			// Clear the form
			replySubjectInput.value = '';
			replyMessageInput.value = '';
		} else {
			alert('Please fill in all fields');
		}
	});

	// Close modals when clicking outside
	window.addEventListener('click', function(e) {
		if (e.target === messageModal) {
			messageModal.style.display = 'none';
		}
		if (e.target === replyModal) {
			replyModal.style.display = 'none';
		}
	});
});

// Function to show reply modal
function showReplyModal(sender) {
	const replyModal = document.getElementById('reply-modal');
	const replyToInput = document.getElementById('reply-to');
	
	replyToInput.value = sender;
	replyModal.style.display = 'flex';
}

// Messenger functionality

// Status change for complaints (RespDashboard only)
function changeStatus(btn, status) {
    // Find the row
    const row = btn.closest('tr');
    if (!row) return;
    // Find the status cell (assume always the last cell)
    const statusCell = row.querySelector('td:last-child .status');
    if (!statusCell) return;
    if (status === 'completed') {
        // Show custom confirmation dialogAdd commentMore actions
        const dialog = document.getElementById('confirmation-dialog');
        dialog.classList.add('show');

        // Handle confirm button
        const confirmBtn = dialog.querySelector('.btn-confirm');
        confirmBtn.onclick = function() {
            statusCell.textContent = 'Completed';
            statusCell.className = 'status completed';
            statusCell.style.background = '#1976d2';
            statusCell.style.color = '#fff';
            dialog.classList.remove('show');
        };

        // Handle cancel button
        const cancelBtn = dialog.querySelector('.btn-cancel');
        cancelBtn.onclick = function() {
            dialog.classList.remove('show');
        };

        // Handle close button
        const closeBtn = dialog.querySelector('.close-confirmation');
        closeBtn.onclick = function() {
            dialog.classList.remove('show');
        };

        // Close dialog when clicking outside
        dialog.onclick = function(e) {
            if (e.target === dialog) {
                dialog.classList.remove('show');
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
	const conversations = document.querySelectorAll('.conversation');
	const chatArea = document.querySelector('.chat-area');
	const chatMessages = document.querySelector('.chat-messages');
	const chatInput = document.getElementById('msg_input');
	const sendBtn = document.querySelector('.send-btn');
	const messagesLink = document.getElementById('messages-link');
	const messagesSection = document.getElementById('messages-section');
	const dashboardLink = document.getElementById('dashboard-link');
	const mainContent = document.querySelector('main');

	// MESSAGE SEARCH FUNCTIONALITY
	const messageSearchInput = document.getElementById('message-search-input');
	if (messageSearchInput) {
		messageSearchInput.addEventListener('input', function() {
		const searchTerm = this.value.toLowerCase();
		let found = false;
		conversations.forEach(conv => {
			const name = conv.querySelector('.conversation-info .conversation-name');
			if (name) {
				const match = name.textContent.toLowerCase().includes(searchTerm);
				conv.style.display = match || searchTerm === '' ? '' : 'none';
				if (match && searchTerm !== '') {
					conv.classList.add('active');
					if (chatArea) {
						chatArea.style.display = '';
					}
					found = true;
				} else {
					conv.classList.remove('active');
				}
			}
		});
		// إذا كان البحث فارغ أظهر جميع المحادثات فقط (لا تخفي أو تظهر chatArea هنا)
		if (searchTerm === '' && chatArea) {
			// لا تغير حالة chatArea هنا حتى لا تتعارض مع النقر اليدوي
		}
		// إذا لم يوجد أي تطابق أخفِ الرسائل
		if (!found && chatArea && searchTerm !== '') {
			chatArea.style.display = 'none';
		}
	});
	}

	// Show messages section when clicking on Messages link
	messagesLink.addEventListener('click', function(e) {
		e.preventDefault();
		// Show messages section
		messagesSection.style.display = 'block';
		
	});

	// Handle conversation clicks
	conversations.forEach(conversation => {
		conversation.addEventListener('click', function() {
			// Remove active class from all conversations
			conversations.forEach(c => c.classList.remove('active'));
			// Add active class to clicked conversation
			this.classList.add('active');
			
			// Update chat header
			const name = this.querySelector('.conversation-name').textContent;
			const avatar = this.querySelector('.conversation-avatar').innerHTML;
			document.querySelector('.chat-name').textContent = name;
			document.querySelector('.chat-avatar').innerHTML = avatar;
		});
	});

	// Handle send message
	function sendMessage() {
		const message = chatInput.value.trim();
		console.log(message);
		socket.emit("private_message",message);//send messge to server
		if (message) {
			const messageElement = document.createElement('div');
			messageElement.className = 'message sent';
			messageElement.innerHTML = `
				<div class="message-content">${message}</div>
				<div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
			`;
			chatMessages.appendChild(messageElement);
			chatInput.value = '';
			chatMessages.scrollTop = chatMessages.scrollHeight;
		}
	}

	// Send message on button click
	
	sendBtn.addEventListener('click', (e) => { 
		e.preventDefault(); 
		sendMessage();
		
        chatMessages.scrollTop = chatMessages.scrollHeight;

	});


	// Send message on Enter key
	chatInput.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			sendMessage();
		}
	});

	// Auto-resize textarea
	chatInput.addEventListener('input', function() {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
});

// PDF Download Functionality
document.getElementById('download-pdf').addEventListener('click', function() {
	// Initialize jsPDF
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();
	
	// Add title
	doc.setFontSize(20);
	doc.text('Dashboard Report', 20, 20);
	
	// Add date
	doc.setFontSize(12);
	doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
	
	// Add box info
	doc.setFontSize(16);
	doc.text('Statistics', 20, 45);
	
	const boxInfo = document.querySelectorAll('.box-info li');
	let yPos = 55;
	
	boxInfo.forEach((box, index) => {
		const title = box.querySelector('h3').textContent;
		const value = box.querySelector('p').textContent;
		
		doc.setFontSize(12);
		doc.text(`${title}: ${value}`, 20, yPos);
		yPos += 10;
	});
	
	// Add table data
	yPos += 10;
	doc.setFontSize(16);
	doc.text('Recent Orders', 20, yPos);
	
	const table = document.querySelector('.table-data .order table');
	const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
	const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
		return Array.from(tr.querySelectorAll('td')).map(td => td.textContent);
	});
	
	doc.autoTable({
		startY: yPos + 10,
		head: [headers],
		body: rows,
		theme: 'grid',
		headStyles: { fillColor: [60, 145, 230] },
		styles: { fontSize: 10 }
	});
	
	// Save the PDF
	doc.save('dashboard-report.pdf');
});

// Analytics Link Functionality
document.addEventListener('DOMContentLoaded', function() {
	const analyticsLink = document.getElementById('analytics-link');
	
	analyticsLink.addEventListener('click', function(e) {
		e.preventDefault();
		hideAllSections();
		document.getElementById('analytics-section').style.display = 'block';
		document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
			item.classList.remove('active');
		});
		this.parentElement.classList.add('active');
	});
});

// Member Selection Functionality
document.querySelectorAll('.member').forEach(member => {
	member.addEventListener('click', function() {
		// Remove selection from all members
		document.querySelectorAll('.member').forEach(m => m.classList.remove('selected'));
		// Select clicked member
		this.classList.add('selected');
		// Enable assign button
		document.querySelector('.assign-btn').disabled = false;
	});
});

// Global variables for assign functionality
let selectedAssignCell = null;
let selectedMember = null;

// Function to select a member
function selectMember(element) {
	// Remove selection from all members
	document.querySelectorAll('.member-item').forEach(item => {
		item.classList.remove('selected');
	});
	
	// Add selection to clicked member
	element.classList.add('selected');
	selectedMember = element;
	
	// Enable assign button
	document.getElementById('assign-button').disabled = false;
}

// Initialize assign functionality
document.addEventListener('DOMContentLoaded', function() {
	const modal = document.getElementById('assign-modal');
	const assignButton = document.getElementById('assign-button');
	const closeButton = document.querySelector('.close-modal');
	const searchInput = document.getElementById('member-search');

	// Handle assign icon clicks
	document.querySelectorAll('.assignee-icon').forEach(icon => {
		icon.addEventListener('click', function(e) {
			e.preventDefault();
			selectedAssignCell = this.closest('.assignee-cell');
			modal.style.display = 'flex';
			
			// Reset selection
			document.querySelectorAll('.member-item').forEach(item => {
				item.classList.remove('selected');
			});
			assignButton.disabled = true;
			selectedMember = null;
		});
	});

	// Handle assign button click
	assignButton.addEventListener('click', function() {
		if (selectedMember && selectedAssignCell) {
			const memberName = selectedMember.textContent.trim();
			
			// Update cell content
			selectedAssignCell.innerHTML = `
				<span class="assigned-member" style="color: #1976d2; font-weight: 500;">
					<i class='bx bx-user' style="margin-right: 5px;"></i>
					${memberName}
				</span>
			`;
			
			// Update status
			const row = selectedAssignCell.closest('tr');
			if (row) {
				const statusCell = row.querySelector('td:last-child span.status');
				if (statusCell) {
					statusCell.textContent = 'Process';
					statusCell.className = 'status process';
				}
			}
			
			// Close modal
			modal.style.display = 'none';
		}
	});

	// Close modal
	closeButton.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	// Close modal on outside click
	window.addEventListener('click', (e) => {
		if (e.target === modal) {
			modal.style.display = 'none';
		}
	});

	// Handle search
	searchInput.addEventListener('input', function() {
		const searchTerm = this.value.toLowerCase();
		document.querySelectorAll('.member-item').forEach(item => {
			const text = item.textContent.toLowerCase();
			item.style.display = text.includes(searchTerm) ? '' : 'none';
		});
	});
});

// Todo Functionality
document.addEventListener('DOMContentLoaded', function() {
	const addTodoBtn = document.getElementById('add-todo');
	const addTodoModal = document.getElementById('add-todo-modal');
	const todoActionsMenu = document.querySelector('.todo-actions-menu');
	let activeTodoItem = null;

	// Show Add Todo Modal
	addTodoBtn.addEventListener('click', function() {
		addTodoModal.style.display = 'flex';
	});

	// Close Modal on outside click
	addTodoModal.addEventListener('click', function(e) {
		if (e.target === addTodoModal) {
			addTodoModal.style.display = 'none';
		}
	});

	// Close Modal on X click
	document.querySelectorAll('.close-modal').forEach(btn => {
		btn.addEventListener('click', function() {
			addTodoModal.style.display = 'none';
		});
	});

	// Save New Todo
	document.getElementById('save-todo').addEventListener('click', function() {
		const todoText = document.getElementById('new-todo-input').value;
		const todoStatus = document.getElementById('todo-status').value;
		
		if (todoText.trim()) {
			const todoList = document.querySelector('.todo-list');
			const newTodo = document.createElement('li');
			newTodo.className = todoStatus;
			newTodo.innerHTML = `
				<p>${todoText}</p>
				<i class='bx bx-dots-vertical-rounded todo-actions'></i>
			`;
			todoList.appendChild(newTodo);
			
			// Clear and close modal
			document.getElementById('new-todo-input').value = '';
			addTodoModal.style.display = 'none';
		}
	});

	// Show Todo Actions Menu
	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('todo-actions')) {
			e.stopPropagation();
			const rect = e.target.getBoundingClientRect();
			activeTodoItem = e.target.closest('li');
			
			todoActionsMenu.style.display = 'block';
			todoActionsMenu.style.top = `${rect.bottom + 5}px`;
			todoActionsMenu.style.left = `${rect.left - 150}px`;
		} else if (!e.target.closest('.todo-actions-menu')) {
			todoActionsMenu.style.display = 'none';
		}
	});

	// Handle Todo Actions
	todoActionsMenu.addEventListener('click', function(e) {
		const action = e.target.closest('.menu-item');
		if (!action || !activeTodoItem) return;

		if (action.classList.contains('delete-todo')) {
			activeTodoItem.remove();
		} else {
			const status = action.dataset.status;
			activeTodoItem.className = status;
			
			// Update corresponding task status if exists
			const todoText = activeTodoItem.querySelector('p').textContent;
			const taskRow = findTaskByTodo(todoText);
			if (taskRow) {
				const statusCell = taskRow.querySelector('.status');
				statusCell.className = `status ${status}`;
				statusCell.textContent = status === 'completed' ? 'Completed' : 
									  status === 'process' ? 'Process' : 'Pending';
			}
		}
		
		todoActionsMenu.style.display = 'none';
	});

	// Function to find task row by todo text
	function findTaskByTodo(todoText) {
		const taskRows = document.querySelectorAll('.order table tbody tr');
		for (let row of taskRows) {
			const taskName = row.querySelector('td:first-child p').textContent;
			if (todoText.includes(taskName)) {
				return row;
			}
		}
		return null;
	}

	// Update Todo when task status changes
	function updateTodoForTask(taskName, status) {
		const todos = document.querySelectorAll('.todo-list li');
		for (let todo of todos) {
			const todoText = todo.querySelector('p').textContent;
			if (todoText.includes(taskName)) {
				todo.className = status.toLowerCase();
				break;
			}
		}
	}

	// Listen for task status changes
	document.addEventListener('taskStatusChanged', function(e) {
		const { taskName, status } = e.detail;
		updateTodoForTask(taskName, status);
	});
});

// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
	const searchInput = document.querySelector('#content nav form .form-input input');
	const searchBtn = document.querySelector('#content nav form .form-input button');
	const orderTable = document.querySelector('.order table tbody');
	const todoList = document.querySelector('.todo-list');

	function performSearch(searchTerm) {
		searchTerm = searchTerm.toLowerCase();

		// Search in orders table
		const orderRows = orderTable.querySelectorAll('tr');
		orderRows.forEach(row => {
			const userName = row.querySelector('td:first-child p').textContent.toLowerCase();
			const date = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
			const status = row.querySelector('.status').textContent.toLowerCase();
			
			if (userName.includes(searchTerm) || date.includes(searchTerm) || status.includes(searchTerm)) {
				row.style.display = '';
			} else {
				row.style.display = 'none';
			}
		});

		// Search in todos
		const todoItems = todoList.querySelectorAll('li');
		todoItems.forEach(todo => {
			const todoText = todo.querySelector('p').textContent.toLowerCase();
			const todoStatus = todo.className.toLowerCase();

			if (todoText.includes(searchTerm) || todoStatus.includes(searchTerm)) {
				todo.style.display = '';
			} else {
				todo.style.display = 'none';
			}
		});
	}

	// Search on input change
	searchInput.addEventListener('input', function() {
		performSearch(this.value);
	});

	// Search on button click
	searchBtn.addEventListener('click', function(e) {
		e.preventDefault();
		performSearch(searchInput.value);
	});
});

// Notifications System
class NotificationSystem {
	constructor() {
		this.notifications = [];
		this.unreadCount = 0;
		this.notificationBell = document.querySelector('.notification');
		this.notificationMenu = document.querySelector('.notifications-menu');
		this.notificationsList = document.querySelector('.notifications-list');
		this.notificationCount = document.querySelector('.notification .num');
		this.clearButton = document.querySelector('.clear-notifications');
		
		this.initializeEventListeners();
	}

	initializeEventListeners() {
		// Toggle notifications menu
		this.notificationBell.addEventListener('click', (e) => {
			e.preventDefault();
			this.notificationMenu.classList.toggle('show');
		});

		// Close notifications menu when clicking outside
		document.addEventListener('click', (e) => {
			if (!this.notificationBell.contains(e.target) && !this.notificationMenu.contains(e.target)) {
				this.notificationMenu.classList.remove('show');
			}
		});

		// Clear all notifications
		this.clearButton.addEventListener('click', () => {
			this.clearAllNotifications();
		});
	}

	addNotification(type, message) {
		const notification = {
			id: Date.now(),
			type,
			message,
			time: new Date(),
			read: false
		};

		this.notifications.unshift(notification);
		this.unreadCount++;
		this.updateNotificationCount();
		this.renderNotifications();
		this.showToast(message);
	}

	createNotificationElement(notification) {
		const element = document.createElement('div');
		element.className = `notification-item ${notification.read ? '' : 'unread'}`;
		
		let iconClass = 'task';
		if (notification.type === 'status') iconClass = 'status';
		if (notification.type === 'assign') iconClass = 'assign';

		element.innerHTML = `
			<div class="icon ${iconClass}">
				<i class='bx ${this.getIconForType(notification.type)}'></i>
			</div>
			<div class="notification-content">
				<div class="notification-text">${notification.message}</div>
				<div class="notification-time">${this.formatTime(notification.time)}</div>
			</div>
		`;

		element.addEventListener('click', () => {
			if (!notification.read) {
				notification.read = true;
				this.unreadCount--;
				this.updateNotificationCount();
				element.classList.remove('unread');
			}
		});

		return element;
	}

	getIconForType(type) {
		switch (type) {
			case 'task': return 'bx-task';
			case 'status': return 'bx-transfer-alt';
			case 'assign': return 'bx-user-plus';
			default: return 'bx-bell';
		}
	}

	formatTime(date) {
		const now = new Date();
		const diff = now - date;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	renderNotifications() {
		this.notificationsList.innerHTML = '';
		this.notifications.forEach(notification => {
			const element = this.createNotificationElement(notification);
			this.notificationsList.appendChild(element);
		});
	}

	updateNotificationCount() {
		this.notificationCount.textContent = this.unreadCount;
		this.notificationCount.style.display = this.unreadCount > 0 ? 'flex' : 'none';
	}

	clearAllNotifications() {
		this.notifications = [];
		this.unreadCount = 0;
		this.updateNotificationCount();
		this.renderNotifications();
	}

	showToast(message) {
		// Create toast element
		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = message;
		document.body.appendChild(toast);

		// Trigger animation
		setTimeout(() => toast.classList.add('show'), 100);

		// Remove toast after 3 seconds
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => toast.remove(), 300);
		}, 3000);
	}
}

// Initialize Notification System
const notificationSystem = new NotificationSystem();

// Add notification listeners to existing functionality
document.addEventListener('DOMContentLoaded', function() {
	// Listen for task assignments
	document.getElementById('assign-button').addEventListener('click', function() {
		if (selectedMember && selectedAssignCell) {
			const memberName = selectedMember.textContent.trim();
			const taskName = selectedAssignCell.closest('tr').querySelector('td:first-child p').textContent;
			notificationSystem.addNotification('assign', `Task "${taskName}" assigned to ${memberName}`);
		}
	});

	// Listen for todo status changes
	document.querySelector('.todo-actions-menu').addEventListener('click', function(e) {
		const action = e.target.closest('.menu-item');
		if (!action || !activeTodoItem) return;

		if (!action.classList.contains('delete-todo')) {
			const status = action.dataset.status;
			const todoText = activeTodoItem.querySelector('p').textContent;
			notificationSystem.addNotification('status', `Todo "${todoText}" marked as ${status}`);
		}
	});

	// Listen for new todos
	document.getElementById('save-todo').addEventListener('click', function() {
		const todoText = document.getElementById('new-todo-input').value;
		if (todoText.trim()) {
			notificationSystem.addNotification('task', `New todo added: "${todoText}"`);
		}
	});
});

// Add toast styles
const style = document.createElement('style');
style.textContent = `
	.toast {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: var(--dark);
		color: var(--light);
		padding: 12px 24px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(100px);
		opacity: 0;
		transition: all 0.3s ease;
	}
	.toast.show {
		transform: translateY(0);
		opacity: 1;
	}
`;
document.head.appendChild(style);

// Team Management
document.addEventListener('DOMContentLoaded', function() {
	const teamLink = document.querySelector('a[href="#"]:has(.bxs-group)');
	const teamSection = document.getElementById('team-section');
	const addMemberBtn = document.getElementById('add-member-btn');
	const addMemberModal = document.getElementById('add-member-modal');
	const saveMemberBtn = document.getElementById('save-member');
	const passwordToggle = document.querySelector('.password-toggle');
	const passwordInput = document.getElementById('member-password');

	// Show team section when clicking on Team link
	teamLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    document.getElementById('team-section').style.display = 'block';
    document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
        item.classList.remove('active');
    });
    this.parentElement.classList.add('active');
});

const analyticsLink = document.getElementById('analytics-link');
const analyticsSection = document.getElementById('analytics-section');

analyticsLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    document.getElementById('analytics-section').style.display = 'block';
    document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
        item.classList.remove('active');
    });
    this.parentElement.classList.add('active');
});

	// Show/Hide password
	passwordToggle.addEventListener('click', function() {
		const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
		passwordInput.setAttribute('type', type);
		this.classList.toggle('bx-show');
		this.classList.toggle('bx-hide');
	});

	// Show add member modal
	addMemberBtn.addEventListener('click', function() {
		addMemberModal.style.display = 'flex';
	});

	// Close modal
	document.querySelectorAll('.close-modal').forEach(btn => {
		btn.addEventListener('click', function() {
			addMemberModal.style.display = 'none';
		});
	});

	// Close modal on outside click
	addMemberModal.addEventListener('click', function(e) {
		if (e.target === addMemberModal) {
			addMemberModal.style.display = 'none';
		}
	});

	// Save new member or edit
	saveMemberBtn.addEventListener('click', function() {
		const name = document.getElementById('member-name').value;
		const email = document.getElementById('member-email').value;
		const password = document.getElementById('member-password').value;
		const team = document.getElementById('member-team').value;
		const role = document.getElementById('member-role').value;

		if (name && email && team && role) {
			if (saveMemberBtn.dataset.editing === 'true') {
				// Edit mode
				const memberElement = addMemberModal.editingMemberElement;
				memberElement.querySelector('.member-details h4').textContent = name;
				memberElement.querySelector('.member-details p').textContent = `${role} · ${email}`;
				// Update member object for future edits
				memberElement.memberData = { name, email, team, role };

				// Move to new team if changed
				const currentTeamContainer = memberElement.parentElement;
				const newTeamContainer = document.querySelector(`.team-card:nth-child(${getTeamIndex(team)}) .team-members`);
				if (currentTeamContainer !== newTeamContainer) {
					newTeamContainer.appendChild(memberElement);
				}

				// Reset modal
				document.getElementById('add-member-form').reset();
				addMemberModal.style.display = 'none';
				saveMemberBtn.textContent = 'Add Member';
				saveMemberBtn.dataset.editing = '';
				saveMemberBtn.dataset.memberId = '';
				addMemberModal.editingMemberElement = null;

				notificationSystem.addNotification('status', `Team member ${name} updated successfully`);
			} else {
				// Add new member mode
				const memberElement = createMemberElement({
					name,
					email,
					team,
					role
				});
				const teamContainer = document.querySelector(`.team-card:nth-child(${getTeamIndex(team)}) .team-members`);
				teamContainer.appendChild(memberElement);
				document.getElementById('add-member-form').reset();
				addMemberModal.style.display = 'none';
				notificationSystem.addNotification('assign', `New team member ${name} added to ${getTeamName(team)}`);
			}
		} else {
			alert('Please fill in all fields');
		}
	});

	// Reset modal state when opening for new member
	addMemberBtn.addEventListener('click', function() {
		saveMemberBtn.textContent = 'Add Member';
		saveMemberBtn.dataset.editing = '';
		saveMemberBtn.dataset.memberId = '';
		addMemberModal.editingMemberElement = null;
	});

	function createMemberElement(member) {
		const div = document.createElement('div');
		div.className = 'team-member';
		div.innerHTML = `
			<div class="member-info">
				<div class="member-avatar">
					<i class='bx bx-user'></i>
				</div>
				<div class="member-details">
					<h4>${member.name}</h4>
					<p>${member.role} · ${member.email}</p>
				</div>
			</div>
			<div class="member-actions">
				<button class="edit" title="Edit Member">
					<i class='bx bx-edit'></i>
				</button>
				<button class="delete" title="Remove Member">
					<i class='bx bx-trash'></i>
				</button>
			</div>
		`;

		// Add delete functionality
		div.querySelector('.delete').addEventListener('click', function() {
			if (confirm('Are you sure you want to remove this member?')) {
				div.remove();
				notificationSystem.addNotification('status', `Team member ${member.name} has been removed`);
			}
		});

		// Add edit functionality
		div.querySelector('.edit').addEventListener('click', function() {
			// Fill modal with current member data
			document.getElementById('member-name').value = member.name;
			document.getElementById('member-email').value = member.email;
			document.getElementById('member-role').value = member.role;
			document.getElementById('member-team').value = member.team;
			document.getElementById('member-password').value = '';
			
			// Show modal
			addMemberModal.style.display = 'flex';

			// Change save button to edit mode
			saveMemberBtn.textContent = 'Save Changes';
			saveMemberBtn.dataset.editing = 'true';
			saveMemberBtn.dataset.memberId = member.email; // Use email as unique id

			// Store reference to this member element
			addMemberModal.dataset.editingMember = '';
			addMemberModal.editingMemberElement = div;
		});

		return div;
	}

	function getTeamIndex(teamValue) {
		const teamMap = {
			'tech-support': 1,
			'customer-service': 2,
			'quality': 3
		};
		return teamMap[teamValue];
	}

	function getTeamName(teamValue) {
		const teamMap = {
			'tech-support': 'Tech Support Team',
			'customer-service': 'Customer Service Team',
			'quality': 'Quality Team'
		};
		return teamMap[teamValue];
	}
});

// Settings and Logout Functionality
document.addEventListener('DOMContentLoaded', function() {
	const settingsLink = document.getElementById('settings-link');
	const settingsSection = document.getElementById('settings-section');
	const logoutBtn = document.querySelector('.logout');
	const logoutModal = document.getElementById('logout-modal');
	const confirmLogoutBtn = document.getElementById('confirm-logout');
	
	// Settings Navigation
	settingsLink.addEventListener('click', function(e) {
		e.preventDefault();
		hideAllSections();
		document.getElementById('settings-section').style.display = 'block';
		document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
			item.classList.remove('active');
		});
		this.parentElement.classList.add('active');
	});

	// Profile Settings
	const profileForm = document.getElementById('profile-form');
	const btnUpload = document.querySelector('.btn-upload');
	const profilePic = document.querySelector('.profile-pic');
	const navbarProfilePic = document.getElementById('navbar-profile-pic');
	
	profileForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const name = document.getElementById('settings-name').value;
		const email = document.getElementById('settings-email').value;
		
		// Here you would typically send this data to your backend
		notificationSystem.addNotification('status', 'Profile settings updated successfully');
	});

	if (btnUpload && profilePic) {
		function handleUpload() {
			let input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/*';
			input.onchange = function(e) {
				const file = e.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = function(ev) {
						profilePic.innerHTML = `<img src="${ev.target.result}" alt="Profile">`;
						btnUpload.textContent = 'Change Photo';
						if (navbarProfilePic) {
							navbarProfilePic.src = ev.target.result;
						}
					};
					reader.readAsDataURL(file);
				}
			};
			input.click();
		}
		btnUpload.addEventListener('click', handleUpload);
	}

	// Security Settings
	const securityForm = document.getElementById('security-form');
	
	securityForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const currentPassword = document.getElementById('current-password').value;
		const newPassword = document.getElementById('new-password').value;
		const confirmPassword = document.getElementById('confirm-password').value;

		if (newPassword !== confirmPassword) {
			alert('New passwords do not match!');
			return;
		}

		// Here you would typically verify and update the password on your backend
		notificationSystem.addNotification('status', 'Password updated successfully');
		this.reset();
	});

	// Notification Settings
	const notificationToggles = document.querySelectorAll('.notification-settings input[type="checkbox"]');
	
	notificationToggles.forEach(toggle => {
		toggle.addEventListener('change', function() {
			const settingName = this.id.replace('-notifications', '');
			const status = this.checked ? 'enabled' : 'disabled';
			notificationSystem.addNotification('status', `${settingName} notifications ${status}`);
		});
	});

	// Logout Modal Functionality
	function showLogoutModal() {
		const modal = document.getElementById('logout-modal');
		modal.style.display = 'flex';
		// Add show class after a small delay to trigger animation
		setTimeout(() => {
			modal.classList.add('show');
		}, 10);
	}

	function hideLogoutModal() {
		const modal = document.getElementById('logout-modal');
		modal.classList.remove('show');
		// Wait for animation to complete before hiding
		setTimeout(() => {
			modal.style.display = 'none';
		}, 300);
	}

	// Show logout modal
	logoutBtn.addEventListener('click', function(e) {
		e.preventDefault();
		showLogoutModal();
	});

	// Close modal on button click
	document.querySelectorAll('#logout-modal .close-modal, #logout-modal .btn-secondary').forEach(button => {
		button.addEventListener('click', hideLogoutModal);
	});

	// Close modal on outside click
	logoutModal.addEventListener('click', function(e) {
		if (e.target === logoutModal) {
			hideLogoutModal();
		}
	});

	// Confirm logout
	confirmLogoutBtn.addEventListener('click', function() {
		// Add fade-out animation
		document.body.style.opacity = '0';
		document.body.style.transition = 'opacity 0.5s ease';
		
		// Redirect after animation
		setTimeout(() => {
			window.location.href = '/Home'; // Replace with your login page URL
		}, 500);
	});
});

// Dashboard Navigation Fix
// تأكد من عدم وجود أي أحداث متكررة أو متضاربة على زر Dashboard
const dashboardLinkBtn = document.getElementById('dashboard-link');
const dashboardLinkClone = dashboardLinkBtn.cloneNode(true);
dashboardLinkBtn.parentNode.replaceChild(dashboardLinkClone, dashboardLinkBtn);

const dashboardLink = document.getElementById('dashboard-link');
dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    // Show dashboard main sections
    document.querySelectorAll('main > .head-title, main > .box-info, main > .table-data').forEach(el => {
        el.style.display = '';
    });
    // Sidebar active state
    document.querySelectorAll('#sidebar .side-menu li').forEach(item => {
        item.classList.remove('active');
    });
    this.parentElement.classList.add('active');
});

// Helper function to hide all main sections
function hideAllSections() {
    // Hide all main content sections
    document.querySelectorAll('main > .head-title, main > .box-info, main > .table-data, #messages-section, #team-section, #analytics-section, #settings-section').forEach(section => {
        if (section) section.style.display = 'none';
    });
    // Hide modals if open
    ['add-member-modal', 'message-modal', 'reply-modal'].forEach(id => {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

//Display Reclamations

async function DisplayReclamations(){
    try {
        const response = await fetch("http://localhost:3000/api/DisplayReclamationLeader", {
          method: "GET",
          credentials: "include", // باش تبعث الكوكي تاع السيشن
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const reclamations = await response.json();
        renderReclamations(reclamations);
        // هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
      } catch (error) {
        console.error("❌ خطأ في جلب الشكاوى:", error);
      }
}
function renderReclamations(reclamations) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = "";  // نفرغ القديم
  
    reclamations.forEach(r => {
        const dateOnly = r.createdAt.substring(0, 10);
      const item = document.createElement("tr");
      let statusClass;
      let icon;
		if(r.Status == 'In Progress'){
			statusClass = 'process';
            icon = 'fa-exclamation-circle';
		}else if(r.Status == 'completed'){
			statusClass = 'completed';
            icon = 'fa-clock';
		}
      item.innerHTML = `
        <td>
	        <p>${r.Name} ${r.Surname}</p>
	    </td>
		<td>${dateOnly}</td>
		<td>
			<div class="status-actions">
				<button class="status-icon-btn info-btn-modern" onclick="showComplaintInfo(this)" title="Complaint Info">
					<i class='bx bx-info-circle'></i>
				</button>
				<button class="status-icon-btn completed-btn" onclick="changeStatus(this, 'completed')" title="Mark as Completed">
					✔
			    </button>
			</div>
		</td>
		<td><span class="status ${statusClass}">${r.Status}</span></td>
      `;
      tbody.appendChild(item);
	  item.onclick = () => {
		UpdateReclamations(r);
		sessionStorage.setItem("recId", r._id);
	  }
    });
  }

  window.addEventListener('load', DisplayReclamations);

//Update reclamation status 
async function UpdateReclamations(r) {
	const completedBtn = document.getElementsByClassName('completed-btn');
	for (let btn of completedBtn) {
  const clone = btn.cloneNode(true); // ننسخو
  btn.replaceWith(clone); // نبدلو
}
	const newBtn = document.getElementById('completed-btn');
	document.querySelectorAll('.completed-btn').forEach(icon => {
		icon.addEventListener('click',async function(e) {
			e.preventDefault();
		try {  
			const response = await fetch(`http://localhost:3000/api/UpdateReclamationLeader/${r._id}`, {
			  method: "PUT",
			  headers: {
                "Content-Type": "application/json"
            },
             
            body: JSON.stringify({ 
            Status : 'completed' })  
			});
			
			if (!response.ok) {
			  throw new Error("فشل في جلب البيانات");
			}console.error('completed');
			DisplayReclamations();
			// هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
		  } catch (error) {
			console.error("❌ خطأ في تحديث الشوى", error);
		  }

	})})
}

//Chat

//receive_message
const socket = io('http://localhost:3000');
const leaderId = sessionStorage.getItem("leaderId");
const adminId = sessionStorage.getItem("adminId");
socket.on('connect', async () => {
    console.log('🔌 متصل بالخادم');
    
    // تسجيل المستخدم
    if (leaderId) {
        socket.emit("register", leaderId);
        console.log("📝 تم التسجيل بـ ID:", leaderId);
		//socket.emit("get receiverId", adminId);
		console.log("admin ID:", adminId);
    }
	
})	

socket.on("receive_message", (data) => {
    console.log("📩 وصلك ميساج:", data);
	const chatMessages = document.querySelector('.chat-messages');
    const message = data.message;
	const createdAt = data.createdAt;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message received';
    msgDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${new Date(createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    chatMessages.appendChild(msgDiv);
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Sent Message

//Chat

const messageForm = document.getElementById('msg-form');
const messageInput = document.getElementById('msg-input');
const messageContainer = document.getElementById('msg-container');
const active = document.getElementsByClassName('conversation active');

socket.on("load-messages", () => {

        DisplayMessages(); // تعرض كل ميساج قديم
});
socket.on("registration_success", (userId) => {
    console.log("✅ Registered to socket server successfully");
});

socket.on("registration_error", (msg) => {
    console.error("❌ Registration failed:", msg);
});


//Display messages
async function DisplayMessages(){
    try {
        const response = await fetch('http://localhost:3000/api/DisplayMessagesLeader', {
          method: "GET",
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const messages = await response.json();
        renderMessages(messages);
        // هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
      } catch (error) {
        console.error("❌ خطأ في جلب الشكاوى:", error);
      }
}


async function renderMessages(message){
	const chatMessages = document.querySelector('.chat-messages');
	chatMessages.innerHTML = "";

	message.forEach(msg => {
		const dateOnly =  new Date(msg.createdAt).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true // حطها true إذا حبيت صيغة 12 ساعة
		  });
		const messageElement = document.createElement('div');
		if(!msg.sender){
			messageElement.className = 'message received';
			messageElement.innerHTML = `
				<div class="message-content">${msg.message}</div>
				<div class="message-time">${dateOnly}</div>
			`;
			chatMessages.appendChild(messageElement);
			chatMessages.scrollTop = chatMessages.scrollHeight;

			}else{
			messageElement.className = 'message sent';
			messageElement.innerHTML = `
				<div class="message-content">${msg.message}</div>
				<div class="message-time">${dateOnly}</div>
			`;
			chatMessages.appendChild(messageElement);
			chatMessages.scrollTop = chatMessages.scrollHeight;
		
		}	
	})
}

//Display information complaint
async function DisplayInformation(){
	try {
        const response = await fetch('http://localhost:3000/api/DisplayInformation', {
          method: "GET",
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const reclamation = await response.json();
        
        // هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
      } catch (error) {
        console.error("❌ خطأ في جلب المعلومات :", error);
      }
}


async function showComplaintInfo(btn) {
const recId = sessionStorage.getItem("recId");
console.log(recId)
	try {
        const response = await fetch(`http://localhost:3000/api/DisplayInformation/${recId}`, {
          method: "GET",
        });
    
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
    
        const data = await response.json();
        
        // هنا تقدر تعرضهم فـ DOM حسب الشكل لي تحب
      
    var row = btn.closest('tr');

	const r = data.reclamations;
	document.getElementById('complaint-modal-overlay').style.display = 'flex';
    document.getElementById('complaint-modal-body').innerText = `
        Type : ${r.Type},
        Fullname : ${r.Name} ${r.Surname},
        Phone : ${r.Phone},
        Municipality : ${r.Municipality},
        Subscriber ID : ${r.Subscriber_ID},
		Address : ${r.Address},
		Complaint : ${r.Complaint},
		`
	const img = document.createElement('img');
	img.src = data.image;
	img.id = 'myImage';
	img.style.maxWidth = '30%';
	document.getElementById('complaint-modal-body').appendChild(img);
  document.body.style.overflow = 'hidden';
  } catch (error) {
        console.error("❌ خطأ في جلب المعلومات :", error);
      }
}
