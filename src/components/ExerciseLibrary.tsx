import React, { useState } from 'react';

// Interface que define a estrutura de cada exercicio
interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: string;
  equipamento: string;
  nivel: string;
  gifUrl: string;
  descricao: string[];
}

// Banco de dados inicial de exercicios bem completo
const BANCO_EXERCICIOS: Exercicio[] = [
  {
    id: '1',
    nome: 'Agachamento Livre',
    grupoMuscular: 'Pernas',
    equipamento: 'Barra',
    nivel: 'Intermediario',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M3RyeXBtZ3Y0cmthY294M3Z6ZndpZnM0bHByY3ZidHl3NmkyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3268WkwraXfQQ/giphy.gif',
    descricao: [
      'Posicione a barra nos ombros (trapezio), mantendo os pes afastados na largura dos ombros.',
      'Mantenha o abdomen bem contraido e o olhar fixo para frente.',
      'Desca o quadril jogando-o para tras, como se fosse sentar em uma cadeira, ate passar a linha do joelho.',
      'Suba empurrando o chao com a forca dos calcanhares, mantendo a coluna reta.'
    ]
  },
  {
    id: '2',
    nome: 'Supino Reto',
    grupoMuscular: 'Peito',
    equipamento: 'Halteres',
    nivel: 'Iniciante',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M3RyeXBtZ3Y0cmthY294M3Z6ZndpZnM0bHByY3ZidHl3NmkyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SZQB1BR4oQv9S/giphy.gif',
    descricao: [
      'Deite-se no banco plano apoiando os pes firmemente no chao.',
      'Segure os halteres alinhados com o meio do peito.',
      'Empurre os pesos para cima estendendo os bracos, sem travar os cotovelos no topo.',
      'Desca controlando o movimento ate os halteres aproximarem do peito.'
    ]
  },
  {
    id: '3',
    nome: 'Remada Curvada',
    grupoMuscular: 'Costas',
    equipamento: 'Barra',
    nivel: 'Avancado',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M3RyeXBtZ3Y0cmthY294M3Z6ZndpZnM0bHByY3ZidHl3NmkyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13FrdqHkl0K848/giphy.gif',
    descricao: [
      'Incline o tronco para frente em um angulo de aproximadamente 45 graus, mantendo as costas bem retas.',
      'Segure a barra com os bracos estendidos para baixo.',
      'Puxe a barra em direcao a boca do estomago, esmagando as escapulas nas costas.',
      'Retorne o peso de forma lenta e controlada ate estender os bracos novamente.'
    ]
  },
  {
    id: '4',
    nome: 'Desenvolvimento de Ombros',
    grupoMuscular: 'Ombros',
    equipamento: 'Halteres',
    nivel: 'Iniciante',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M3RyeXBtZ3Y0cmthY294M3Z6ZndpZnM0bHByY3ZidHl3NmkyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qE0gOGw6jHnRGL6/giphy.gif',
    descricao: [
      'Sente-se em um banco com apoio para as costas e levante os halteres na altura das orelhas.',
      'Mantenha os cotovelos apontados levemente para a frente.',
      'Empurre os halteres para cima em linha reta ate os bracos quase se estenderem por completo.',
      'Desca os pesos devagar ate retornar a posicao inicial do lado da cabeca.'
    ]
  }
];

export default function ExerciseLibrary() {
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');
  const [nivelSelecionado, setNivelSelecionado] = useState('Todos');

  const exerciciosFiltrados = BANCO_EXERCICIOS.filter((ex) => {
    const bateBusca = ex.nome.toLowerCase().includes(busca.toLowerCase());
    const bateGrupo = grupoSelecionado === 'Todos' || ex.grupoMuscular === grupoSelecionado;
    const bateNivel = nivelSelecionado === 'Todos' || ex.nivel === nivelSelecionado;
    return bateBusca && bateGrupo && bateNivel;
  });

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      padding: '20px',
      fontFamily: 'sans-serif',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#ff4757', margin: '0 0 10px 0' }}>Biblioteca de Exercícios</h1>
        <p style={{ color: '#a4b0be', margin: 0 }}>Escolha as opções abaixo e veja a execução correta.</p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '500px',
        margin: '0 auto 30px auto',
        backgroundColor: '#1e1e1e',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
      }}>
        <input
          type="text"
          placeholder="Digite o nome do exercício..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #333',
            backgroundColor: '#2f3542',
            color: '#fff',
            fontSize: '16px'
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={grupoSelecionado}
            onChange={(e) => setGrupoSelecionado(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#2f3542',
              color: '#fff',
              fontSize: '14px'
            }}
          >
            <option value="Todos">Todos os Músculos</option>
            <option value="Pernas">Pernas</option>
            <option value="Peito">Peito</option>
            <option value="Costas">Costas</option>
            <option value="Ombros">Ombros</option>
          </select>

          <select
            value={nivelSelecionado}
            onChange={(e) => setNivelSelecionado(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#2f3542',
              color: '#fff',
              fontSize: '14px'
            }}
          >
            <option value="Todos">Todos os Níveis</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediario">Intermediário</option>
            <option value="Avancado">Avançado</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {exerciciosFiltrados.length > 0 ? (
          exerciciosFiltrados.map((ex) => (
            <div key={ex.id} style={{
              backgroundColor: '#1e1e1e',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                height: '240px',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img
                  src={ex.gifUrl}
                  alt={ex.nome}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  loading="lazy"
                />
              </div>

              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: 'rgba(255, 47, 87, 0.15)',
                    color: '#ff4757',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>{ex.grupoMuscular}</span>
                  <span style={{
                    backgroundColor: 'rgba(46, 213, 115, 0.15)',
                    color: '#2ed573',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>{ex.nivel}</span>
                  <span style={{
                    backgroundColor: 'rgba(255, 165, 0, 0.15)',
                    color: '#ffa500',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>{ex.equipamento}</span>
                </div>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#fff' }}>{ex.nome}</h3>
                
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a4b0be', textTransform: 'uppercase' }}>Passo a Passo:</h4>
                <ol style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {ex.descricao.map((passo, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{passo}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#a4b0be' }}>
            Nenhum exercício encontrado com esses filtros.
          </div>
        )}
      </div>
    </div>
  );
      }
              
