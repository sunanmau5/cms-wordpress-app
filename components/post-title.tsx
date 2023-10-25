export default function PostTitle({ children }) {
  return (
    <h1
      className="mx-20 my-16 text-left text-4xl font-bold"
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}
