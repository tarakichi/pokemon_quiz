import Chat from "../components/Chat";
import Quiz from "../components/Quiz";
import UserName from "../components/UserName";
import UserList from "../components/UsersList";

export default function Game() {
    return (
        <div className='min-h-screen bg-gray-900 overflow-hidden flex flex-col items-center justify-center px-5 py-5'>
            <div className='w-full max-w-screen-md mx-auto px-4 py-6 bg-gray-100 rounded-2xl ring-gray-900/5 shadow-xl'>
                <Quiz/>
                <Chat/>
                <UserName/>
                <UserList/>
            </div>
            <footer className="mt-3 text-gray-400 text-xs font-thin font-notosans text-center">
                <div>
                    画像:&nbsp;
                    <a href='https://pokemonshowdown.com/' target='_blank' className='underline'>Pokémon Showdown</a>
                </div>
                    （©&nbsp;
                    <a href='https://www.nintendo.com/jp/index.html' target='_blank' className='underline'>Nintendo</a> /&nbsp;
                    <a href='https://www.gamefreak.co.jp/' target='_blank' className='underline'>Game Freak</a> /&nbsp;
                    <a href='https://www.creatures.co.jp/' target='_blank' className='underline'>Creatures Inc.</a>
                    ）
            </footer>
        </div>
    )
}