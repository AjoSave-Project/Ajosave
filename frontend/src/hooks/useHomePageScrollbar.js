import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook to apply home page scrollbar styling
 * Adds 'home-page' class to html and body for public pages before login/signup
 */
export const useHomePageScrollbar = () => {
  const location = useLocation()

  useEffect(() => {
    // Define which routes should have the custom blue scrollbar
    const homePageRoutes = [
      '/',
      '/about',
      '/how-it-works',
      '/contact',
      '/privacy-policy',
      '/terms-conditions',
      '/refund-policy',
      '/help',
      '/security',
      '/trust-safety',
      '/community-guidelines',
      '/onboarding',
      '/welcome',
      '/auth',
      '/auth/signin',
      '/auth/signup',
      '/auth/verify-contact',
      '/auth/kyc-verify',
      '/auth/complete-profile'
    ]

    const isHomePage = homePageRoutes.includes(location.pathname)

    if (isHomePage) {
      document.documentElement.classList.add('home-page')
      document.body.classList.add('home-page')
    } else {
      document.documentElement.classList.remove('home-page')
      document.body.classList.remove('home-page')
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.documentElement.classList.remove('home-page')
      document.body.classList.remove('home-page')
    }
  }, [location.pathname])
}