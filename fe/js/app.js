(function (window) {
	'use strict';
	// Your starting point. Enjoy the ride!	
	
	// 페이지 로드 <- 할 일 리스트 보이기 
	$().ready(function() {
		selectTodo();
	});
	
	var newTodo = $('.new-todo');
	var todoList = $('.todo-list');
	var all = $('.filters').children().first().children();

	// 이벤트 처리 
	// (1) 할 일 등록하기 - 이벤트 
	newTodo.keydown('click', function(e){
		if(e.keyCode == 13){			// 엔터키 누를때 
			if(newTodo.val() != ""){	// 빈 문자가 아닐때 
				var todoObj = {'todo': newTodo.val(), 'completed': 0, 'date': new Date()};
				insertTodo(todoObj);
			}
		}
	});
	
	// (2) 할 일 완료하기 - 이벤트 
	todoList.on('click', '.toggle', function(){
		var id = $(this).parent().parent().attr('id');
		updateTodo(id);
	});

	// (3) 할 일 삭제하기 - 이벤트 
	todoList.on('click', '.destroy', function(){
		var id = $(this).parent().parent().attr('id');
		deleteTodo(id);
	});

	// (4) 할 일 리스트를 필터링 - 이벤트 
	$('.filters').on('click', 'a', function(){
		filterTodos($(this));
	});
	
	// (5) 완료한 일 삭제 - 이벤트 
	$('.clear-completed').click(function(){
		var complted = $('.completed');
		
		$.each(complted, function(index, item){
			deleteTodo(complted[index].id);
		});
	})
	
	function selectTodo(){
		$.ajax({
			url: '/api/todos',
			method: 'GET',
			contentType: "application/json; charset=UTF-8",
			dataType: 'json',
			success: function(data){
				todoList.empty();
				if(data.length > 0){
					countTodos(data);
					filterTodos(all);
				}
			}
		});
		
		return false;
	}
	
	function countTodos(todoObjs){
		var NotCompletedTodoCnt = 0;			// 초기화	
		
		$.each(todoObjs, function(index, item){
			var li = $('<li id= "' + todoObjs[index].id + '">');
			var div = $('<div class="view">');
			var checkbox = $('<input class="toggle" type="checkbox">');
			
			if(todoObjs[index].completed == 1){
				li.addClass('completed');
				checkbox.attr('checked', 'checked');
			} else {
				NotCompletedTodoCnt++;
			}

			div.append(checkbox);
			div.append('<label>' + todoObjs[index].todo + '</label>');
			div.append('<button class = "destroy"></button>');
			
			li.append(div);
			li.append('<input class="edit" value ="Create a TodoMVC template">');
			
			todoList.append(li);
			
			// 할 일 개수 보여주기 
			$('.todo-count > strong').html(NotCompletedTodoCnt);
		});
		
		return false;
	}
	
	function filterTodos(aTag){
		$('.filters > li > a').removeClass('selected');
		aTag.removeAttr('href');
		aTag.addClass('selected');
		
		if(aTag.html() == 'All'){
			$('.todo-list > li').show();
		} else if(aTag.html() == 'Active'){
			$('.todo-list > li').show();
			$('.completed').hide();
		} else if(aTag.html() == 'Completed'){
			$('.todo-list > li').hide();
			$('.completed').show();
		}
		
		return false;
	}
	
	function insertTodo(todoObj){		
		$.ajax({
			url: '/api/todos',
			method: 'POST',
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(todoObj),
			success: function(){
				newTodo.val('');
				selectTodo();
			}
		});	
	}
	
	function updateTodo(id){
		var todoObj = {'completed': 1};
		
		$.ajax({
			url: '/api/todos/' + id,
			method: 'PUT',
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(todoObj),
			success: function(){
				selectTodo();
			}
		});
	}
	
	function deleteTodo(id){
		$.ajax({
			url: '/api/todos/' + id,
			method: 'DELETE',
			contentType: "application/json; charset=UTF-8",
			success: function(){
				selectTodo();
			}
		});
	}
	
})(window);

