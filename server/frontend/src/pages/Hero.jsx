import React from 'react';
import { motion } from 'framer-motion';
import { Github, Zap, Shield } from 'lucide-react';

const Hero = () => {
  const handleLogin = () => {
    // Redirect to backend Google Auth route
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Background aesthetic blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl"
      >
        <div className="mb-6 flex justify-center space-x-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="p-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl"
          >
            <Github className="w-10 h-10 text-blue-400" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="p-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl"
          >
            <Zap className="w-10 h-10 text-yellow-400" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="p-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl"
          >
            <Shield className="w-10 h-10 text-green-400" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tight">
          RepoScanAI
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Evaluate GitHub repositories and developer profiles the way a technical recruiter or senior engineer does.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all flex items-center mx-auto"
        >
          <Github className="mr-2" />
          Try Now with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;
