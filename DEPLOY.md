# Deploy Instructions - Ponte Finance Marketplace

## 🚀 Build e Deploy

### 1. Build do Projeto

```bash
# Instalar dependências
npm install

# Fazer build para produção
npm run build
```

### 2. Configuração do Servidor

O projeto está configurado para rodar em `https://ponte.finance/marketplace_/`

#### Estrutura de Arquivos no Servidor:
```
/marketplace_/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── .htaccess
└── build-info.txt
```

### 3. Upload para o Servidor

1. **Faça o build:**
   ```bash
   npm run build
   ```

2. **Upload da pasta `dist`:**
   - Faça upload de todo o conteúdo da pasta `dist` para `/marketplace_/` no servidor
   - Certifique-se de incluir o arquivo `.htaccess`

3. **Verificar configuração:**
   - Acesse `https://ponte.finance/marketplace_/`
   - Teste todas as rotas (Home, Login, Property Details, etc.)

### 4. Configuração do Apache (.htaccess)

O arquivo `.htaccess` já está configurado com:
- ✅ Client-side routing para Vue.js SPA
- ✅ Headers de segurança
- ✅ Cache de assets estáticos
- ✅ Compressão GZIP
- ✅ CORS para API calls
- ✅ Proteção de arquivos sensíveis

### 5. Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build local
npm run preview

# Deploy automático (Linux/Mac)
./deploy.sh
```

### 6. Verificações Pós-Deploy

- [ ] Home page carrega corretamente
- [ ] Navegação entre páginas funciona
- [ ] Imagens e assets carregam
- [ ] API calls funcionam
- [ ] Rotas do Vue Router funcionam (refresh da página)
- [ ] Responsividade em mobile
- [ ] Performance e cache funcionando

### 7. Troubleshooting

#### Problema: Página em branco após deploy
**Solução:** Verificar se o `.htaccess` foi uploadado corretamente

#### Problema: Assets não carregam (CSS/JS)
**Solução:** Verificar se a base URL está configurada como `/marketplace_/`

#### Problema: Rotas não funcionam ao atualizar página
**Solução:** Verificar se o rewrite rule do `.htaccess` está ativo

#### Problema: API calls falham
**Solução:** Verificar configuração de CORS no `.htaccess`

### 8. URLs Importantes

- **Home:** `https://ponte.finance/marketplace_/`
- **Login Investor:** `https://ponte.finance/marketplace_/auth/investor/login`
- **Login Broker:** `https://ponte.finance/marketplace_/auth/broker/login`
- **Property Details:** `https://ponte.finance/marketplace_/investor/property/{id}`

---

**Nota:** Este projeto é uma SPA (Single Page Application) Vue.js que requer configuração adequada do servidor web para funcionar corretamente.
