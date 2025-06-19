import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface Todo {
  id: number;
  title: string;
}

function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data, error } = await supabase.from('todos').select();

        if (error) {
          setError('Failed to fetch todos');
          console.error(error);
          return;
        }

        if (data && data.length > 0) {
          setTodos(data);
        } else {
          setTodos([]);
        }
      } catch (err) {
        setError('Unexpected error occurred');
        console.error(err);
      }
    };

    getTodos();
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ) : (
        <p>No todos available.</p>
      )}
    </div>
  );
}

export default Page;
