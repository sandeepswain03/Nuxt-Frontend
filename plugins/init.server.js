import {defineNuxtPlugin, showError} from "nuxt/app";
import {useIndexStore} from "../store";
import {useCommonStore} from "../store/common";
import {storeToRefs} from "pinia";
import {useLanguageStore} from "../store/language";
import {useAuthStore} from "../store/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    try{
        const config = useRuntimeConfig();
        const token = useCookie(config.public.auth_token_key);

        const {setToken} = useAuthStore()

        if(token.value) {
            setToken(token.value);
        }

        const commonStore = useCommonStore()
        const {hasCommonData} = storeToRefs(commonStore)
        if (hasCommonData.value){
            return false
        }

        const cookieLang = useCookie('currentLanguage');

        const {setCommonData, unAuthGet} = commonStore

        const response = await unAuthGet({api: 'common', params: '', lang: cookieLang.value})

        const responseData = response.data

        // Override img_src_url with configured image base URL if available
        if (config.public.imageBaseUrl && responseData.img_src_url) {
          // If API returns a relative URL, prepend the configured base URL
          if (responseData.img_src_url.startsWith('/') || !responseData.img_src_url.startsWith('http')) {
            const imagePath = responseData.img_src_url.replace(/^\/+/, '')
            responseData.img_src_url = config.public.imageBaseUrl + (imagePath ? '/' + imagePath : '')
          } else if (!responseData.img_src_url.includes('ecomapi.7pixs.com')) {
            // If API returns a different domain, replace with configured base URL
            const imagePath = responseData.img_src_url.replace(/^https?:\/\/[^\/]+/, '')
            responseData.img_src_url = config.public.imageBaseUrl + imagePath
          }
        }

        const {setMediaData} = useIndexStore()
        setMediaData(responseData)

        const languageStore = useLanguageStore()
        const {setLanguages, setDefaultLanguage, setLangCode, setCurrentLanguage, getLangData} = languageStore
        const {languages, defaultLanguage} = storeToRefs(languageStore)

        setLanguages(responseData.languages)

        if (responseData?.default_language) {
            setDefaultLanguage(responseData.default_language)
        }

        if (cookieLang.value && languages.value[cookieLang.value]) {
            setCurrentLanguage(languages.value[cookieLang.value])

        } else if (responseData.default_language) {
            setCurrentLanguage(responseData.default_language)
        }

        if (cookieLang.value !== defaultLanguage?.value?.code) {
            setLangCode(cookieLang.value)
        } else {
            setLangCode(null)
        }


        await getLangData()

        setCommonData(responseData)


    }catch(e){
        showError({
            statusCode: 400,
            message: e.message
        })
    }


});
