import connect from '@/utils/startMongo'

export default async function Database() {
  const client = await connect
  const cursor = await client.db("test").collection("greetings").find();
  const greetings = await cursor.toArray()

  return (
    <>
      {greetings.map((greetingObj) => (
        <h1>{greetingObj.greeting}</h1>
      ))}
    </>
  );
}
