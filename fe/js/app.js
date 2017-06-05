(function (window) {
	'use strict';
	// Your starting point. Enjoy the ride!	
	
	// 페이지 로드 <- 할 일 리스트 보이기 
	$(document).ready(function() {
		selectTodo();
	});
	
	var newTodo = $('.new-todo');
	var todoList = $('.todo-list');
	var all = $('.filters').children().eq(0).children();
	
	var NotCompletedCnt;

	// 이벤트 처리 
	// (1) 할 일 등록하기 - 이벤트 
	newTodo.keydown('click', function(e){
		if(e.keyCode == 13){
			if(newTodo.val() != ""){
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
			success: function(responseData){
				todoList.empty();
				if(responseData.length > 0){
					countTodos(responseData);
					filterTodos(all);
					$('.todo-count > strong').html(NotCompletedCnt);
				}
			}
		});
		
		return false;
	}
	
	function countTodos(todoObjs){
		NotCompletedCnt = 0;		
		
		$.each(todoObjs, function(index, item){
			var li = $('<li id= "' + todoObjs[index].id + '">');
			var checkbox = $('<input class="toggle" type="checkbox">');
			
			if(todoObjs[index].completed == 1){
				li.attr('class', 'completed');
				checkbox.attr('checked', 'checked');
			} else {
				NotCompletedCnt++;
			}

			var div = $('<div class="view">');
			var label = $('<label>').append(todoObjs[index].todo);
			var button = $('<button class = "destroy">');
			div.append(checkbox);
			div.append(label);
			div.append(button);
			
			var inputBox = $('<input class="edit" value = "edit">');
			li.append(div);
			li.append(inputBox);
			
			todoList.append(li);
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
			success: function(responseData){
				newTodo.val('');
				selectTodo();
			}
		});
		
		return false;	
	}
	
	function updateTodo(id){
		var todoObj = {'completed': 1};
		
		$.ajax({
			url: '/api/todos/' + id,
			method: 'PUT',
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(todoObj),
			success: function(responseData){
				selectTodo();
			}
		});
	
		return false;
	}
	
	function deleteTodo(id){
		$.ajax({
			url: '/api/todos/' + id,
			method: 'DELETE',
			contentType: "application/json; charset=UTF-8",
			success: function(responseData){
				selectTodo();
			}
		});
	
		return false;
	}
	
})(window);

