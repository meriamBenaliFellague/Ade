document.addEventListener('DOMContentLoaded', function() {
    // Create the actions menu
    const menu = document.createElement('div');
    menu.className = 'todo-actions-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="completed">
            <i class='bx bx-check-circle'></i> Mark as Completed
        </div>
        <div class="menu-item" data-action="process">
            <i class='bx bx-time-five'></i> Mark as In Progress
        </div>
        <div class="menu-item" data-action="not-completed">
            <i class='bx bx-x-circle'></i> Mark as Not Completed
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item delete-todo" data-action="delete">
            <i class='bx bx-trash'></i> Delete Todo
        </div>
    `;
    document.body.appendChild(menu);

    // Function to hide menu
    function hideMenu() {
        menu.classList.remove('show');
        setTimeout(() => {
            if (!menu.classList.contains('show')) {
                menu.style.display = 'none';
            }
        }, 150);
    }


    // Handle clicks on todo action buttons
    document.addEventListener('click', function(e) {
        // Handle click on todo action button
        if (e.target.classList.contains('todo-actions') || e.target.closest('.todo-actions')) {
            e.preventDefault();
            e.stopPropagation();
            
            const actionBtn = e.target.classList.contains('todo-actions') ? e.target : e.target.closest('.todo-actions');
            const todoItem = actionBtn.closest('li');
            const rect = actionBtn.getBoundingClientRect();
            
            // Toggle menu if clicking the same button
            if (menu.dataset.activeTodo === String(Array.from(todoItem.parentNode.children).indexOf(todoItem)) && 
                menu.style.display === 'block') {
                menu.classList.remove('show');
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 150);
                return;
            }
            
            // Position the menu
            menu.style.display = 'block';
            menu.style.top = `${rect.bottom + window.scrollY}px`;
            menu.style.left = `${rect.left + window.scrollX - 120}px`;
            
            // Store reference to the active todo item
            menu.dataset.activeTodo = Array.from(todoItem.parentNode.children).indexOf(todoItem);
            
            // Show with animation
            setTimeout(() => {
                menu.classList.add('show');
            }, 10);
        } 
        // Handle click on menu items
        else if (e.target.closest('.menu-item')) {
            e.preventDefault();
            e.stopPropagation();
            
            const menuItem = e.target.closest('.menu-item');
            const action = menuItem.dataset.action;
            const todoIndex = menu.dataset.activeTodo;
            const todoItem = document.querySelector(`.todo-list li:nth-child(${parseInt(todoIndex) + 1})`);
            
            if (!todoItem) {
                hideMenu();
                return;
            }
            
            // Handle the action
            if (action === 'delete') {
                todoItem.style.animation = 'fadeOut 0.2s ease-out';
                setTimeout(() => {
                    todoItem.remove();
                }, 200);
            } else {
                // Add transition effect for status change
                todoItem.style.opacity = '0.7';
                todoItem.style.transition = 'opacity 0.2s ease';
                
                setTimeout(() => {
                    // Remove all status classes
                    todoItem.classList.remove('completed', 'process', 'not-completed');
                    // Add the new status class
                    todoItem.classList.add(action);
                    todoItem.style.opacity = '1';
                }, 200);
            }
            
            // Hide the menu
            hideMenu();
        }
        // Close menu when clicking outside
        else if (!e.target.closest('.todo-actions-menu')) {
            hideMenu();
        }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideMenu();
        }
    });
    
    // Close menu when scrolling
    window.addEventListener('scroll', function() {
        if (menu.style.display === 'block') {
            hideMenu();
        }
    }, true);
});
