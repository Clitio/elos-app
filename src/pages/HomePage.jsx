import React from 'react'
//necessary import to utilize React in every page
import { Link } from 'react-router-dom'
//A href faster to be more dinamic

const HomePage = () => {
  //the component HomePage return only ONE thing. Rule to be followed by all pages
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Elos</h1>
        <p className="text-xl mb-2">Conectando brasileiros em Cork, Irlanda.</p>
        <p className="text-lg mb-8 text-green-100">
          Encontra profissionais que falam a tua língua e entendem a tua cultura.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50"
          >
            Cadastra-te
          </Link>
          <Link
            to="/directory"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
          >
            Ver Profissionais
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          O que procuras?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Saúde', icon: '🏥', path: '/health' },
            { label: 'Alimentação', icon: '🍽️', path: '/food' },
            { label: 'Transporte', icon: '🚗', path: '/transport' },
            { label: 'Beleza', icon: '💇', path: '/beauty' },
            { label: 'Acomodação', icon: '🏠', path: '/accommodation' },
            { label: 'Comunidade', icon: '🤝', path: '/community' },
            { label: 'Dia a Dia', icon: '📦', path: '/daily-basis' },
            { label: 'Diretório', icon: '📋', path: '/directory' },
          ].map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-green-400 transition"
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-gray-700 font-semibold">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Missao */}
      <section className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Por que o Elos?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Muitos brasileiros chegam à Irlanda sem saber inglês e enfrentam 
          dificuldades simples do dia a dia — ir à farmácia, encontrar um médico, 
          ou até arranjar um cabeleireiro. O Elos existe para que ninguém 
          precise passar por isso sozinho.
        </p>
        <Link
          to="/about"
          className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Saiba mais sobre nós
        </Link>
      </section>

      {/* Footer simples */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        © 2025 Elos — Feito com ❤️ para a comunidade brasileira em Cork
      </footer>
    </div>
  )
}

export default HomePage