import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Sobre o Elos</h1>
        <p className="text-gray-500 text-lg">A nossa missao e a nossa historia</p>
      </div>

      {/* Missao */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">A Nossa Missao</h2>
        <p className="text-gray-600 leading-relaxed">
          O Elos nasceu da experiencia real de brasileiros que chegaram a Irlanda e enfrentaram
          dificuldades simples do dia a dia por nao falar ingles. Ir a farmacia, encontrar um medico,
          ou ate arranjar um cabeleireiro pode ser um desafio enorme quando nao consegues comunicar.
        </p>
        <p className="text-gray-600 leading-relaxed mt-4">
          O Elos existe para que ninguem precise passar por isso sozinho. Conectamos brasileiros
          em Cork para que possas encontrar profissionais que falam a tua lingua e entendem
          a tua cultura.
        </p>
      </div>

      {/* Como funciona */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Como Funciona</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <h3 className="font-bold text-gray-800">Cria a tua conta</h3>
              <p className="text-gray-600 text-sm mt-1">Regista-te como utilizador ou profissional em poucos minutos.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <h3 className="font-bold text-gray-800">Encontra quem precisas</h3>
              <p className="text-gray-600 text-sm mt-1">Navega pelas categorias ou usa a pesquisa para encontrar profissionais em Cork.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <h3 className="font-bold text-gray-800">Entra em contacto</h3>
              <p className="text-gray-600 text-sm mt-1">Fala diretamente com o profissional em portugues, sem barreiras.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Criador */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quem criou o Elos</h2>
        <p className="text-gray-600 leading-relaxed">
          O Elos foi criado por um estudante brasileiro de Ciencias da Computacao no Griffith College
          em Cork. Vivendo na Irlanda, viu de perto as dificuldades da comunidade brasileira e
          decidiu usar a tecnologia para fazer a diferenca.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/register"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Junta-te ao Elos
        </Link>
      </div>

    </div>
  )
}

export default AboutPage