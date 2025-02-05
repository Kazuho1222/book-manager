import { use, useActionState, useRef } from 'react'
import './App.css'
import { BookManage, type BookState, type BookManageJson } from './domain/book'
import { handleAddBook } from './bookActions'

async function fetchManageBook() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await fetch("http://localhost:8080/books")
  const data = (await response.json()) as BookManageJson[]
  return data.map((book) => new BookManage(book.id, book.name, book.status))
}

const fetchManageBookPromise = fetchManageBook()

function App() {
  const initialBooks = use(fetchManageBookPromise)
  const addFormRef = useRef<HTMLFormElement>(null)
  const [bookState, updateBookState, isPending] = useActionState(
    async (
      prevState: BookState | undefined,
      formData: FormData
    ): Promise<BookState> => {
      if (!prevState) {
        throw new Error("Invalid state")
      }

      return handleAddBook(prevState, formData)
    },
    {
      allBooks: initialBooks,
    }
  )

  return (
    <>
      <div>
        <form action={updateBookState} ref={addFormRef}>
          <input
            type="text"
            name="bookName"
            placeholder='書籍名'
          />
          <button type='submit' disabled={isPending}>
            追加
          </button>
        </form>
        <div>
          <ul>
            {bookState.allBooks.map((book: BookManage) => {
              return <li key={book.id}>{book.name}</li>
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
