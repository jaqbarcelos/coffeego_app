import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [cupomSelecionado, setCupomSelecionado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [toastFavoritoMsg, setToastFavoritoMsg] = useState('');

  function adicionarAoPedido(produto) {
    setPedido(anterior => {
      const existe = anterior.find(p => p.id === produto.id);
      if (existe) {
        return anterior.map(p =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
        );
      }
      return [...anterior, { ...produto, quantidade: 1 }];
    });
  }

  function removerDoPedido(produtoId) {
    setPedido(anterior => {
      const existe = anterior.find(p => p.id === produtoId);
      if (existe && existe.quantidade > 1) {
        return anterior.map(p =>
          p.id === produtoId ? { ...p, quantidade: p.quantidade - 1 } : p
        );
      }
      return anterior.filter(p => p.id !== produtoId);
    });
  }

  function limparPedido() {
    setPedido([]);
    setCupomSelecionado(null);
  }

  function adicionarFavorito(item, tipo) {
    const jaExiste = favoritos.find(f => f.id === item.id && f.tipo === tipo);
    if (jaExiste) {
      setFavoritos(ant => ant.filter(f => !(f.id === item.id && f.tipo === tipo)));
      return false;
    }
    setFavoritos(ant => [...ant, { ...item, tipo }]);
    setToastFavoritoMsg(`${item.nome} salvo nos favoritos!`);
    setTimeout(() => setToastFavoritoMsg(''), 3000);
    return true;
  }

  function removerFavorito(id, tipo) {
    setFavoritos(ant => ant.filter(f => !(f.id === id && f.tipo === tipo)));
  }

  function isFavorito(id, tipo) {
    return favoritos.some(f => f.id === id && f.tipo === tipo);
  }

  const subtotal = pedido.reduce(
    (soma, item) => soma + parseFloat(item.preco || 0) * item.quantidade, 0
  );
  const desconto = cupomSelecionado ? cupomSelecionado.valor : 0;
  const totalPedido = Math.max(0, subtotal - desconto) + 5;

  return (
    <AppContext.Provider value={{
      usuarioLogado, setUsuarioLogado,
      pedido, adicionarAoPedido, removerDoPedido, limparPedido,
      subtotal, totalPedido, desconto,
      cupomSelecionado, setCupomSelecionado,
      enderecoEntrega, setEnderecoEntrega,
      favoritos, adicionarFavorito, removerFavorito, isFavorito,
      toastFavoritoMsg,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}