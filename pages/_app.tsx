import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'
import { useUserDataFireBase } from '../lib/hooks'

function MyApp({ Component, pageProps }) {
	const userData = useUserDataFireBase()

	return (
		<>
			<UserContext.Provider value={userData}>
				<Navbar />
				<Component {...pageProps} />
				<Toaster position="top-right"
					reverseOrder={true} />
			</UserContext.Provider>
		</>
	)
}

export default MyApp
