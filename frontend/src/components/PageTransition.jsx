const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};
const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.8 };
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {" "}
      {children}{" "}
    </motion.div>
  );
};
export default PageTransition;
