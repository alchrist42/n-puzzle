document.addEventListener('DOMContentLoaded', () => {
    // Save curent room in localstorage (for situation when user returning)
    const room = document.querySelector("#room").innerHTML;
    localStorage.setItem('room', room);

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        // connect user to this room when page is loaded
        socket.emit('join', {'room': room});

        // send new message by press button
        document.querySelector('#send_msg').onsubmit = () => {
                const text_msg = document.querySelector("#text_msg").value;
                const for_user = document.querySelector("#for_user").value;
                socket.emit('send_msg', {'text_msg': text_msg, 'room': room, 'for_user': for_user});

                // Clear input field
                document.querySelector('#text_msg').value = '';

                // Stop form from submitting
                return false;
        };
    });


    // When a new message is received, add it to the chat
    socket.on('new_row', data => {
        // Create new row for chat
        const row = document.createElement('div');

        // time message
        const time = document.createElement('span');
        time.className = "row_time";
        time.innerHTML = data.row[0];
        row.append(time);

        // If personal message
        if (data.pm) {
            const from_u = document.createElement('span');
            from_u.className = "from_to";
            from_u.innerHTML = ' from ';
            row.append(from_u);

            const user = document.createElement('span');
            user.className = "row_user";
            user.innerHTML = ` ${data.row[1]} `;
            row.append(user);

            const to_u = document.createElement('span');
            to_u.className = "from_to";
            to_u.innerHTML = 'to ';
            row.append(to_u);

            const user_to = document.createElement('span');
            user_to.className = "row_user";
            user_to.innerHTML = ` ${data.pm}: `;
            row.append(user_to);
        }
        // broadcast message
        else {
            const user = document.createElement('span');
            user.className = "row_user";
            user.innerHTML = ` ${data.row[1]}: `;
            row.append(user);
        }

        // main text message
        row.append(data.row[2]);

        // add row to chat
        document.querySelector("#chat").append(row);
        scroll_to_bot();
    });


    // Join new user
    socket.on('new_user', data => {
        // create and post new row to chat
        const row = document.createElement('div');
        row.className = 'system_msg';
        row.innerHTML = `${data.time} Join ${data.user} to room`;
        document.querySelector("#chat").append(row);

        update_users(data);
        scroll_to_bot();
    });


    // User leaved the room
    socket.on('leave_user', data => {
        // create and post new row to chat
        const row = document.createElement('div');
        row.className = 'system_msg';
        row.innerHTML = `${data.time} ${data.user} leave the room`;
        document.querySelector("#chat").append(row);

        update_users(data);
        scroll_to_bot();
    });


    // By default, submit button is disabled
    document.querySelector('#sbm').disabled = true;
    // Enable button only if there is text in the input field
    document.querySelector('#text_msg').onkeyup = () => {
        if (document.querySelector('#text_msg').value.length > 0)
            document.querySelector('#sbm').disabled = false;
        else
            document.querySelector('#sbm').disabled = true;
    };


    // Close button (leave room)
    document.querySelector('#close_room').onclick = () => {
        // not work in Firefox without timeout
        setTimeout(() => { socket.emit('leave', {'room': room}); }, 50);
        localStorage.setItem('room', '');
        window.location.href = "/";
    };


    // Logout link
    document.querySelector('#logout').onclick = () => {
        // not work in Firefox without timeout
        setTimeout(() => { socket.emit('leave', {'room': room}); }, 50);
        localStorage.setItem('room', '');
    };

});


function update_users(data) {
    // Refresh users list
    document.querySelector("#list_users").innerHTML = '';
    for (const i in data.users) {
        const a = document.createElement('a');
        a.innerHTML = data.users[i];
        a.className = "list-group-item list-group-item-action p-0 m-0 bg-light user_link";
        a.setAttribute('href', '#');
        document.querySelector("#list_users").append(a);
    }
    document.querySelector("#total_users").innerHTML = data.users.length;

    // click by any username runing personal messaging
    document.querySelectorAll('.user_link').forEach(link => {
        link.onclick = () => {
            const select = document.querySelector('#for_user');
            const to_user = link.innerHTML;

            // Create new option if not any
            if (select.length < 2) {
                const option = document.createElement('option');
                select.add(option);
            }

            // change and select new option
            select[1].innerHTML = link.innerHTML;
            select[1].value = to_user;
            select.selectedIndex = 1;

            //focus in input field
            document.querySelector("#text_msg").focus();

            // Stop link
            return false;
         };
    });
}


function scroll_to_bot() {
    // scroll chat-windows to last message
    var objDiv = document.getElementById("main_window");
    objDiv.scrollTop = objDiv.scrollHeight;
}

