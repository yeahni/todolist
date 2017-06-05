package kr.or.connect.todo.persistence;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.todo.domain.Todo;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TodoDaoTest {
	@Autowired
	private TodoDao dao;

	@Test
	public void shouldCount() {
		int count = dao.countTodos();
		System.out.println(count);
	}
	
	@Test
	public void shouldSelectAll() {
		List<Todo> allTodos = dao.selectAll();
		assertThat(allTodos, is(notNullValue()));
	}
	
	@Test
	public void shouldInsertAndSelectById() {
		// given
		Todo todo = new Todo("InsertTest", 0, new Date());
		
		// when
		Integer id = dao.insert(todo);
		
		// then
		Todo selected = dao.selectById(id);
		assertThat(selected.getTodo(), is("InsertTest"));
	}
	
	@Test
	public void shouldUpdate() {
		// given
		Todo todo = new Todo("UpdateTest", 0, new Date());
		Integer id = dao.insert(todo);

		// when
		todo.setId(id);
		todo.setCompleted(1);
		int affected = dao.update(todo);

		// then
		assertThat(affected, is(1));
		Todo updated = dao.selectById(id);
		assertThat(updated.getCompleted(), is(1));
	}
	
	@Test
	public void shouldDeleteById() {
		// given
		Todo todo = new Todo("DeleteTest", 0, new Date());
		Integer id = dao.insert(todo);

		// when
		int affected = dao.deleteById(id);

		// Then
		assertThat(affected, is(1));
	}	
}