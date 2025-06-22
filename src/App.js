import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp';
import Toast from './components/Toast';
import SignIn from './Pages/SignIn';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Listing from './Pages/Listing';
import Profile from './Pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import MyListings from './Pages/MyListings';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Footer from './components/Footer';
import About from './Pages/About';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
          
          <Route path="/my-listings/:id" element={<MyListings />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update/listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
