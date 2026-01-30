import ConfessionCard from "./ConfessionCard";

interface Confession {
  id: string;
  content: string;
  createdAt: string;
}

interface ConfessionListProps {
  confessions: Confession[];
}

const ConfessionList: React.FC<ConfessionListProps> = ({ confessions }) => {
  return (
    <>
      {confessions.map((confession) => (
        <ConfessionCard key={confession.id} {...confession} />
      ))}
    </>
  );
};

export default ConfessionList;
