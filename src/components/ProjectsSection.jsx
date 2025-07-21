
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Calendar, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProjectsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🌟' },
    { id: 'defi', name: 'DeFi', icon: '💰' },
    { id: 'gamefi', name: 'GameFi', icon: '🎮' },
    { id: 'nft', name: 'NFT', icon: '🖼️' },
    { id: 'dao', name: 'DAO', icon: '🏛️' },
    { id: 'metaverse', name: 'Metaverse', icon: '🌐' }
  ];

  const projects = [
    {
      id: 1,
      name: 'DeFiMax Protocol',
      category: 'defi',
      description: 'Protocolo de yield farming de próxima generación con estrategias automatizadas.',
      roi: '245%',
      tvl: '$125M',
      participants: '12.5K',
      launchDate: '2024-02-15',
      status: 'live',
      risk: 'medium',
      logo: '💎',
      tags: ['Yield Farming', 'Auto-compound', 'Multi-chain']
    },
    {
      id: 2,
      name: 'CyberRealms',
      category: 'gamefi',
      description: 'MMORPG blockchain con economía play-to-earn y NFTs únicos.',
      roi: '180%',
      tvl: '$89M',
      participants: '45.2K',
      launchDate: '2024-03-01',
      status: 'upcoming',
      risk: 'high',
      logo: '⚔️',
      tags: ['P2E', 'MMORPG', 'NFT Gaming']
    },
    {
      id: 3,
      name: 'ArtVault DAO',
      category: 'nft',
      description: 'DAO para inversión colectiva en arte digital y NFTs de alta calidad.',
      roi: '95%',
      tvl: '$67M',
      participants: '8.9K',
      launchDate: '2024-01-20',
      status: 'live',
      risk: 'low',
      logo: '🎨',
      tags: ['Art', 'Collectibles', 'Community']
    },
    {
      id: 4,
      name: 'MetaCity Builder',
      category: 'metaverse',
      description: 'Plataforma para crear y monetizar experiencias en el metaverso.',
      roi: '320%',
      tvl: '$156M',
      participants: '23.1K',
      launchDate: '2024-04-10',
      status: 'upcoming',
      risk: 'high',
      logo: '🏗️',
      tags: ['Virtual Worlds', 'Creator Economy', 'VR/AR']
    },
    {
      id: 5,
      name: 'GreenChain Carbon',
      category: 'dao',
      description: 'DAO enfocada en proyectos de sostenibilidad y créditos de carbono.',
      roi: '78%',
      tvl: '$34M',
      participants: '5.6K',
      launchDate: '2024-01-05',
      status: 'live',
      risk: 'low',
      logo: '🌱',
      tags: ['Sustainability', 'Carbon Credits', 'ESG']
    },
    {
      id: 6,
      name: 'LiquidityHub',
      category: 'defi',
      description: 'Agregador de liquidez cross-chain con optimización automática.',
      roi: '156%',
      tvl: '$203M',
      participants: '18.7K',
      launchDate: '2024-02-28',
      status: 'live',
      risk: 'medium',
      logo: '🌊',
      tags: ['Cross-chain', 'Liquidity', 'DEX Aggregator']
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const toggleFavorite = (projectId) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleInvest = (project, mode) => {
    const modeText = mode === 'demo' ? 'modo demo' : 'modo real';
    toast({
      title: `🚀 Inversión en ${modeText}`,
      description: `Has iniciado inversión en ${project.name} en ${modeText}.`,
    });
  };

  const handleJoinProject = (project) => {
    toast({
      title: "🎉 Unido al proyecto",
      description: `Te has unido a ${project.name}. ¡Bienvenido a la comunidad!`,
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-500/20';
      case 'upcoming': return 'text-blue-400 bg-blue-500/20';
      case 'ended': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-bold">Proyectos Web3</h1>
        <p className="text-gray-400">Descubre e invierte en el futuro descentralizado</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="scrollbar-hide overflow-x-auto"
      >
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className={`whitespace-nowrap ${selectedCategory === category.id 
                ? 'bg-green-500 text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                  {project.logo}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status === 'live' ? 'En vivo' : project.status === 'upcoming' ? 'Próximamente' : 'Finalizado'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(project.risk)}`}>
                      Riesgo {project.risk === 'low' ? 'Bajo' : project.risk === 'medium' ? 'Medio' : 'Alto'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(project.id)}
                className={`${favorites.includes(project.id) ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4">{project.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">{project.roi}</span>
                </div>
                <p className="text-xs text-gray-400">ROI Estimado</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-blue-400">
                  <Star className="w-4 h-4" />
                  <span className="font-bold">{project.tvl}</span>
                </div>
                <p className="text-xs text-gray-400">TVL</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-purple-400">
                  <Users className="w-4 h-4" />
                  <span className="font-bold">{project.participants}</span>
                </div>
                <p className="text-xs text-gray-400">Participantes</p>
              </div>
            </div>

            {/* Launch Date */}
            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {project.status === 'upcoming' ? 'Lanzamiento: ' : 'Lanzado: '}
                {new Date(project.launchDate).toLocaleDateString('es-ES')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {project.status === 'live' ? (
                <>
                  <Button
                    onClick={() => handleInvest(project, 'demo')}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Modo Demo
                  </Button>
                  <Button
                    onClick={() => handleInvest(project, 'real')}
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Invertir Real
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleJoinProject(project)}
                  size="sm"
                  className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  Unirse al Proyecto
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
          <p className="text-gray-400">No se encontraron proyectos en esta categoría.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsSection;
