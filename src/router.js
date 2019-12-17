import Vue from 'vue'
import Router from 'vue-router'
import ProjectMenu from './components/project/project-menu.vue'
import UserMenu from './components/user/user-menu.vue'
import ProjectInfo from './components/project/project-info'
import HeaderMenu from './components/header-menu'
import ReportIndex from './components/report/report-index'
import Login from './components/index/index-login'
import Teach from './components/index/index-teach'
import UserInfo from './components/user/user-info'
import Answer from './components/activity/activity-answer'
import TeacherExamine from './components/my/teacher-examine'
import StudentUpload from './components/my/student-upload'
import ScoreContent from './components/plan/look-score'
import ScoringIndex from './components/scoring/index'
import ScoringResult from './components/scoring/scoring-result'

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    {
      path: '/',
      name:'login',
      component: Login
    },
    {
      path: '/project',
      name:'list',
      component: HeaderMenu,
      children:[
        {
          path:"/ScoreContent",
          name:"ScoreContent",
          component:ScoreContent
        },
        {
          path: '/1',
          name:'ProjectMenu',
          component: ProjectMenu
        },
        {
          path:"/5",
          name:'teach',
          component:Teach
        },
        {
          path:"/5-2",
          name:"TeacherExamine",
          component:TeacherExamine
        },
        {
          path:"/5-1",
          name:StudentUpload,
          component:StudentUpload
        },
        {
          path: '/2',
          name:'UserMenu',
          component: UserMenu
        },
        {
          path: '/4',
          name:'ReportIndex',
          component: ReportIndex
        },
        {
          path: '/scoring',
          name:'ScoringIndex',
          component:ScoringIndex
        },
        {
          path: '/scoringResult',
          name:'ScoringResult',
          component:ScoringResult
        },
        {
          path: '/toProjectInfo',
          name:'ProjectInfo',
          component: ProjectInfo
        },
        {
          path:'/userInfo',
          name:"UserInfo",
          component:UserInfo
        },
        {
          path:'/answerQuestion',
          name:"Answer",
          component:Answer
        }
      ]
    },

  ]
})
