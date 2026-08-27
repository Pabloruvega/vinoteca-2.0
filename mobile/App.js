import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getVinos, login, crearVenta, obtenerMisCompras, API_BASE } from './api';

const LOGO_G1 = require('./assets/logo-g1.png');
const IMG_PLACEHOLDER = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500';

// ─── Paleta (misma que la web) ───────────────────────────────────────────────
const C = {
  wine:      '#5a1a1f',
  wineDark:  '#3e1015',
  wineLight: '#7a2a30',
  cream:     '#f5f0e8',
  creamDark: '#ede8df',
  ink:       '#2e1f14',
  inkLight:  'rgba(46,31,20,0.6)',
  inkFaint:  'rgba(46,31,20,0.1)',
  vine:      '#3d6b45',
  white:     '#ffffff',
  amber:     '#b45309',
  red:       '#991b1b',
};

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio);
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ view, setView, user, onLogout, cartCount }) {
  return (
    <View style={s.header}>
      <View style={s.headerTop}>
        <View style={s.headerBrandRow}>
          <Image source={LOGO_G1} style={s.headerLogo} resizeMode="cover" />
          <View>
            <Text style={s.headerBrand}>Bodega G1</Text>
            <Text style={s.headerSub}>SAN JUAN · ARGENTINA</Text>
          </View>
        </View>
        {user ? (
          <TouchableOpacity onPress={onLogout}>
            <Text style={s.headerLogout}>Salir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setView('login')}>
            <Text style={s.headerLogin}>Ingresar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.headerNav}>
        {[
          { id: 'catalog', label: 'Catálogo' },
          { id: 'cart',    label: `Carrito${cartCount > 0 ? ` (${cartCount})` : ''}` },
          { id: 'compras', label: 'Mis Compras' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[s.navTab, view === tab.id && s.navTabActive]}
            onPress={() => setView(tab.id)}
          >
            <Text style={[s.navTabText, view === tab.id && s.navTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Card de vino ────────────────────────────────────────────────────────────
function VinoCard({ item, onAgregar }) {
  const [imgError, setImgError] = useState(false);
  const imageUri = (item.image && !imgError)
    ? `${API_BASE}${item.image}`
    : IMG_PLACEHOLDER;

  const sinStock  = item.stock <= 0;
  const bajoStock = item.stock > 0 && item.stock <= 3;

  return (
    <View style={s.card}>
      {/* Imagen */}
      <View style={s.cardImageWrap}>
        <Image
          source={{ uri: imageUri }}
          style={s.cardImage}
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
        <View style={s.badge}>
          <Text style={s.badgeText}>{item.tipo?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={s.cardBody}>
        <Text style={s.cardEyebrow}>{item.tipo} · {item.anio || '—'}</Text>
        <Text style={s.cardTitle}>{item.nombre}</Text>
        <Text style={s.cardBodega}>{item.bodega}</Text>

        {sinStock  && <Text style={s.stockNone}>Sin stock</Text>}
        {bajoStock && <Text style={s.stockLow}>Últimas {item.stock} unidades</Text>}

        <View style={s.cardFooter}>
          <Text style={s.cardPrice}>{formatPrecio(item.precio)}</Text>
          {!sinStock && (
            <TouchableOpacity style={s.btnAgregar} onPress={() => onAgregar(item)}>
              <Text style={s.btnAgregarText}>Agregar →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── App principal ───────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]       = useState('catalog');
  const [vinos, setVinos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart]       = useState([]);
  const [user, setUser]       = useState(null);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => { cargarCatalogo(); }, []);

  useEffect(() => {
    if (view === 'compras' && user) cargarCompras();
  }, [view, user]);

  const cargarCatalogo = async () => {
    setLoading(true);
    try {
      const data = await getVinos();
      setVinos(data);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const cargarCompras = async () => {
    setLoadingCompras(true);
    try {
      const data = await obtenerMisCompras(user.token);
      setCompras(data);
    } catch {
      setCompras([]);
    } finally {
      setLoadingCompras(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { setLoginError('Completá todos los campos.'); return; }
    setLoggingIn(true);
    setLoginError('');
    try {
      const userData = await login(email, password);
      setUser(userData);
      setView('catalog');
      setEmail('');
      setPassword('');
    } catch (error) {
      setLoginError(error.message || 'Email o contraseña incorrectos.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCompras([]);
    setView('catalog');
  };

  const addToCart = (vino) => {
    if (vino.stock <= 0) { Alert.alert('Sin stock', 'Este vino no está disponible.'); return; }
    const existe = cart.find(i => i.vinoId === vino._id);
    if (existe) {
      if (existe.cantidad >= vino.stock) {
        Alert.alert('Límite', `Stock disponible: ${vino.stock}`);
        return;
      }
      setCart(cart.map(i => i.vinoId === vino._id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCart([...cart, { vinoId: vino._id, nombre: vino.nombre, precio: vino.precio, cantidad: 1, stock: vino.stock }]);
    }
  };

  const removeFromCart = (vinoId) => setCart(cart.filter(i => i.vinoId !== vinoId));

  const updateQuantity = (vinoId, delta) => {
    setCart(cart.map(i => {
      if (i.vinoId !== vinoId) return i;
      const nueva = i.cantidad + delta;
      if (nueva <= 0) return i;
      if (nueva > i.stock) { Alert.alert('Límite', `Stock máximo: ${i.stock}`); return i; }
      return { ...i, cantidad: nueva };
    }));
  };

  const totalCarrito = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const procesarCompra = async () => {
    if (!user) {
      Alert.alert('Sesión requerida', 'Iniciá sesión para comprar.', [
        { text: 'Ir al login', onPress: () => setView('login') },
        { text: 'Cancelar', style: 'cancel' },
      ]);
      return;
    }
    try {
      const items = cart.map(i => ({ vino: i.vinoId, nombre: i.nombre, cantidad: i.cantidad, precioUnitario: i.precio }));
      await crearVenta(items, totalCarrito, user.token);
      Alert.alert('¡Compra realizada! 🍷', 'Tu pedido fue registrado.');
      setCart([]);
      setView('catalog');
      cargarCatalogo();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo procesar la compra.');
    }
  };

  const cartCount = cart.reduce((acc, i) => acc + i.cantidad, 0);

  // ── Render catálogo ────────────────────────────────────────────────────────
  const renderCatalogo = () => (
    loading ? (
      <View style={s.center}>
        <ActivityIndicator size="large" color={C.wine} />
        <Text style={s.loadingText}>Cargando vinos...</Text>
      </View>
    ) : (
      <FlatList
        data={vinos}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <VinoCard item={item} onAgregar={addToCart} />}
        contentContainerStyle={s.list}
        refreshing={loading}
        onRefresh={cargarCatalogo}
        ListHeaderComponent={
          <View style={s.pageHeader}>
            <Text style={s.pageEyebrow}>LA COLECCIÓN</Text>
            <Text style={s.pageTitle}>Nuestros vinos</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={s.emptyText}>No hay vinos disponibles.</Text>
        }
      />
    )
  );

  // ── Render carrito ─────────────────────────────────────────────────────────
  const renderCarrito = () => (
    <ScrollView contentContainerStyle={s.list}>
      <View style={s.pageHeader}>
        <Text style={s.pageEyebrow}>TU SELECCIÓN</Text>
        <Text style={s.pageTitle}>Carrito</Text>
      </View>

      {cart.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={s.emptyText}>Explorá el catálogo y elegí tus vinos.</Text>
          <TouchableOpacity style={s.btnPrimary} onPress={() => setView('catalog')}>
            <Text style={s.btnPrimaryText}>Ver catálogo →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cart.map(item => (
            <View key={item.vinoId} style={s.cartItem}>
              <View style={{ flex: 1 }}>
                <Text style={s.cartItemName}>{item.nombre}</Text>
                <Text style={s.cartItemPrice}>{formatPrecio(item.precio)} c/u</Text>
              </View>
              <View style={s.qControls}>
                <TouchableOpacity style={s.qBtn} onPress={() => updateQuantity(item.vinoId, -1)}>
                  <Text style={s.qBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.qNum}>{item.cantidad}</Text>
                <TouchableOpacity style={s.qBtn} onPress={() => updateQuantity(item.vinoId, 1)}>
                  <Text style={s.qBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.vinoId)} style={{ paddingLeft: 12 }}>
                <Text style={s.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Resumen */}
          <View style={s.resumen}>
            <View style={s.resumenRow}>
              <Text style={s.resumenLabel}>Total</Text>
              <Text style={s.resumenTotal}>{formatPrecio(totalCarrito)}</Text>
            </View>
            <TouchableOpacity style={s.btnPrimary} onPress={procesarCompra}>
              <Text style={s.btnPrimaryText}>
                {user ? 'Confirmar compra →' : 'Ingresar para comprar →'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCart([])} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={s.vaciarText}>Vaciar carrito</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );

  // ── Render mis compras ─────────────────────────────────────────────────────
  const renderCompras = () => {
    if (!user) {
      return (
        <View style={[s.center, { padding: 30 }]}>
          <Text style={s.emptyTitle}>Necesitás iniciar sesión</Text>
          <TouchableOpacity style={[s.btnPrimary, { marginTop: 20 }]} onPress={() => setView('login')}>
            <Text style={s.btnPrimaryText}>Ingresar →</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (loadingCompras) {
      return (
        <View style={s.center}>
          <ActivityIndicator size="large" color={C.wine} />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={s.list}>
        <View style={s.pageHeader}>
          <Text style={s.pageEyebrow}>TU CUENTA</Text>
          <Text style={s.pageTitle}>Mis compras</Text>
        </View>

        {compras.length === 0 ? (
          <Text style={s.emptyText}>Todavía no realizaste compras.</Text>
        ) : (
          compras.map(order => (
            <View key={order._id} style={s.orderCard}>
              <View style={s.orderHeader}>
                <Text style={s.orderFecha}>
                  {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                <Text style={s.orderTotal}>{formatPrecio(order.total)}</Text>
              </View>
              {order.items.map(item => (
                <View key={`${order._id}-${item.vino}`} style={s.orderItem}>
                  <Text style={s.orderItemNombre}>{item.nombre}</Text>
                  <Text style={s.orderItemDetalle}>
                    {item.cantidad} × {formatPrecio(item.precioUnitario)}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  // ── Render login ───────────────────────────────────────────────────────────
  const renderLogin = () => (
    <ScrollView contentContainerStyle={[s.list, s.loginWrap]}>
      <Image source={LOGO_G1} style={s.loginLogo} resizeMode="cover" />
      <Text style={s.loginEyebrow}>BIENVENIDO</Text>
      <Text style={s.loginTitle}>Iniciar sesión</Text>
      <Text style={s.loginSub}>Ingresá para ver tu historial y comprar</Text>

      <View style={s.loginForm}>
        <Text style={s.inputLabel}>Email</Text>
        <TextInput
          style={s.input}
          placeholder="tu@email.com"
          placeholderTextColor={C.inkLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={s.inputLabel}>Contraseña</Text>
        <TextInput
          style={s.input}
          placeholder="••••••••"
          placeholderTextColor={C.inkLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loginError !== '' && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{loginError}</Text>
          </View>
        )}

        <TouchableOpacity style={s.btnPrimary} onPress={handleLogin} disabled={loggingIn}>
          {loggingIn
            ? <ActivityIndicator color={C.cream} />
            : <Text style={s.btnPrimaryText}>Ingresar →</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={C.wine} />
        <Header
          view={view}
          setView={setView}
          user={user}
          onLogout={handleLogout}
          cartCount={cartCount}
        />
        <View style={{ flex: 1, backgroundColor: C.cream }}>
          {view === 'catalog' && renderCatalogo()}
          {view === 'cart'    && renderCarrito()}
          {view === 'compras' && renderCompras()}
          {view === 'login'   && renderLogin()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
 container: { flex: 1, backgroundColor: C.wine },

  // Header
 header: { backgroundColor: C.wine, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerBrandRow: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: C.cream },
  headerBrand: { color: C.cream, fontSize: 22, fontWeight: '700', letterSpacing: 0.5 },
  headerSub: { color: 'rgba(245,240,232,0.6)', fontSize: 9, letterSpacing: 3, marginTop: 1 },
  headerLogin: { color: C.cream, fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  headerLogout: { color: 'rgba(245,240,232,0.5)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  headerNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(245,240,232,0.15)' },
  navTab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  navTabActive: { borderBottomWidth: 2, borderBottomColor: C.cream },
  navTabText: { color: 'rgba(245,240,232,0.5)', fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  navTabTextActive: { color: C.cream },

  // Layout
  list: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: C.inkLight, marginTop: 10, fontSize: 14 },

  // Page header
  pageHeader: { marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.inkFaint },
  pageEyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 3, color: C.vine, marginBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: C.ink, letterSpacing: 0.3 },

  // Card vino
  card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.inkFaint, marginBottom: 16, overflow: 'hidden' },
  cardImageWrap: { position: 'relative', backgroundColor: C.creamDark },
  cardImage: { width: '100%', height: 240 },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(245,240,232,0.92)', paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: C.ink },
  cardBody: { padding: 14 },
  cardEyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 2, color: C.vine, marginBottom: 4 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 4 },
  cardBodega: { fontSize: 13, color: C.inkLight, marginBottom: 8 },
  stockLow: { fontSize: 11, fontWeight: '700', color: C.amber, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  stockNone: { fontSize: 11, fontWeight: '700', color: C.red, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: C.inkFaint, marginTop: 6 },
  cardPrice: { fontSize: 18, fontWeight: '700', color: C.wine },
  btnAgregar: { paddingVertical: 6, paddingHorizontal: 14, borderWidth: 1, borderColor: C.wine },
  btnAgregarText: { fontSize: 12, fontWeight: '600', color: C.wine, letterSpacing: 0.5 },

  // Carrito
  cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.inkFaint },
  cartItemName: { fontSize: 15, fontWeight: '600', color: C.ink, marginBottom: 3 },
  cartItemPrice: { fontSize: 12, color: C.inkLight },
  qControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.inkFaint },
  qBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  qBtnText: { fontSize: 16, color: C.inkLight },
  qNum: { width: 28, textAlign: 'center', fontSize: 14, fontWeight: '600', color: C.ink },
  removeText: { fontSize: 13, color: C.inkLight },
  resumen: { marginTop: 24, padding: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.inkFaint },
  resumenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resumenLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.inkLight },
  resumenTotal: { fontSize: 24, fontWeight: '700', color: C.wine },
  vaciarText: { fontSize: 11, color: C.inkLight, textTransform: 'uppercase', letterSpacing: 1 },

  // Mis compras
  orderCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.inkFaint, marginBottom: 14 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: C.inkFaint },
  orderFecha: { fontSize: 12, color: C.inkLight },
  orderTotal: { fontSize: 16, fontWeight: '700', color: C.wine },
  orderItem: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.inkFaint },
  orderItemNombre: { fontSize: 14, fontWeight: '600', color: C.ink },
  orderItemDetalle: { fontSize: 12, color: C.inkLight, marginTop: 2 },

  // Login
  loginWrap: { flexGrow: 1, justifyContent: 'center' },
  loginLogo: { width: 88, height: 88, borderRadius: 44, alignSelf: 'center', marginBottom: 18, backgroundColor: C.white },
  loginEyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 3, color: C.vine, textAlign: 'center', marginBottom: 6 },
  loginTitle: { fontSize: 28, fontWeight: '700', color: C.ink, textAlign: 'center' },
  loginSub: { fontSize: 13, color: C.inkLight, textAlign: 'center', marginTop: 6, marginBottom: 24 },
  loginForm: { backgroundColor: C.white, borderWidth: 1, borderColor: C.inkFaint, padding: 20 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: C.ink, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: C.inkFaint, backgroundColor: C.cream, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: C.ink, marginBottom: 16 },
  errorBox: { borderWidth: 1, borderColor: '#fca5a5', backgroundColor: '#fef2f2', padding: 12, marginBottom: 14 },
  errorText: { fontSize: 13, color: C.red },

  // Botón primario
  btnPrimary: { backgroundColor: C.wine, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { color: C.cream, fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },

  // Empty states
  emptyTitle: { fontSize: 20, fontWeight: '700', color: C.ink, textAlign: 'center', marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.inkLight, textAlign: 'center', marginTop: 8 },
});