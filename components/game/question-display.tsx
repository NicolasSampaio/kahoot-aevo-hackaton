import { motion } from 'framer-motion';

interface QuestionDisplayProps {
  question: string;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="text-3xl font-bold text-center mb-8 text-white"
    >
      {question}
    </motion.div>
  );
}