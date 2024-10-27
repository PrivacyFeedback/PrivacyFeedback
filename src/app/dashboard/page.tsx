'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Lock, Shield, UserCheck, Zap, PlusCircle, DollarSign, BarChart2, MessageSquare, Gift, ChevronRight, Activity, Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronDown, Filter } from "lucide-react"

const mockServices = [
  { id: 1, name: 'Service A', interactions: 100, feedbacks: 50, rating: 4.5 },
  { id: 2, name: 'Service B', interactions: 75, feedbacks: 30, rating: 3.8 },
  { id: 3, name: 'Service C', interactions: 120, feedbacks: 60, rating: 4.2 },
]

const mockFeedbacks = [
  {
    id: 1,
    serviceId: 1,
    date: '2023-06-01',
    overallRating: 4,
    responses: [
      { question: "How easy was it to use our service?", answer: "Very easy", rating: 5 },
      { question: "How satisfied are you with the customer support?", answer: "Quite satisfied", rating: 4 },
      { question: "How likely are you to recommend our service to others?", answer: "Very likely", rating: 5 },
      { question: "How well did our service meet your expectations?", answer: "Met expectations", rating: 4 },
      { question: "How would you rate the value for money of our service?", answer: "Good value", rating: 4 },
    ]
  },
  {
    id: 2,
    serviceId: 1,
    date: '2023-06-02',
    overallRating: 5,
    responses: [
      { question: "How easy was it to use our service?", answer: "Extremely easy", rating: 5 },
      { question: "How satisfied are you with the customer support?", answer: "Very satisfied", rating: 5 },
      { question: "How likely are you to recommend our service to others?", answer: "Definitely will recommend", rating: 5 },
      { question: "How well did our service meet your expectations?", answer: "Exceeded expectations", rating: 5 },
      { question: "How would you rate the value for money of our service?", answer: "Excellent value", rating: 5 },
    ]
  },
  {
    id: 3,
    serviceId: 1,
    date: '2023-06-03',
    overallRating: 3,
    responses: [
      { question: "How easy was it to use our service?", answer: "Somewhat easy", rating: 3 },
      { question: "How satisfied are you with the customer support?", answer: "Neutral", rating: 3 },
      { question: "How likely are you to recommend our service to others?", answer: "Might recommend", rating: 3 },
      { question: "How well did our service meet your expectations?", answer: "Met some expectations", rating: 3 },
      { question: "How would you rate the value for money of our service?", answer: "Fair value", rating: 3 },
    ]
  },
]

const mockAnalytics = [
  { name: 'Jan', interactions: 65, feedbacks: 40 },
  { name: 'Feb', interactions: 59, feedbacks: 30 },
  { name: 'Mar', interactions: 80, feedbacks: 50 },
  { name: 'Apr', interactions: 81, feedbacks: 55 },
  { name: 'May', interactions: 56, feedbacks: 35 },
  { name: 'Jun', interactions: 55, feedbacks: 40 },
]

export default function Dashboard() {
  const [services, setServices] = useState(mockServices)
  const [selectedService, setSelectedService] = useState(null)
  const [isAddingService, setIsAddingService] = useState(false)
  const { toast } = useToast()

  const handleAddService = (serviceData) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
      interactions: 0,
      feedbacks: 0,
      rating: 0,
    }
    setServices([...services, newService])
    setIsAddingService(false)
    toast({
      title: "Service Added",
      description: `Your new service ${serviceData.name} has been added successfully.`,
    })
  }

  const handleReward = (feedbackId) => {
    toast({
      title: "Reward Sent",
      description: `Reward has been sent for feedback ID: ${feedbackId}`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <header className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">PrivateFeedbackSDK Dashboard</h1>
          <nav className="space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-blue-400">Services</Button>
            <Button variant="ghost" className="text-gray-300 hover:text-blue-400">Analytics</Button>
          </nav>
        <w3m-button/>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          {!selectedService ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-blue-400">Your Services</h2>
                <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100 border border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-blue-400">Add New Service</DialogTitle>
                      <DialogDescription className="text-gray-400">Enter the details for your new service.</DialogDescription>
                    </DialogHeader>
                    <AddServiceForm onSubmit={handleAddService} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-blue-400">{service.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Rating: {service.rating.toFixed(1)} / 5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-gray-300 mb-4">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-green-400" />
                          <span>{service.interactions} Interactions</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>{service.feedbacks} Feedbacks</span>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedService(service)} variant="outline" className="w-full text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900">
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Overall Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Legend />
                        <Bar dataKey="interactions" fill="#3B82F6" />
                        <Bar dataKey="feedbacks" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ServiceDetails
              service={selectedService}
              feedbacks={mockFeedbacks.filter(f => f.serviceId === selectedService.id)}
              onBack={() => setSelectedService(null)}
              onReward={handleReward}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function AddServiceForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [feedbackQuestions, setFeedbackQuestions] = useState([{ type: 'rating', question: '' }])

  const handleAddQuestion = () => {
    setFeedbackQuestions([...feedbackQuestions, { type: 'rating', question: '' }])
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...feedbackQuestions]
    updatedQuestions[index][field] = value
    setFeedbackQuestions(updatedQuestions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, description, feedbackQuestions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-200">Service Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-700 text-gray-100 border-gray-600" />
      </div>
      <div>
        <Label htmlFor="description" className="text-gray-200">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-gray-700 text-gray-100 border-gray-600" />
      </div>
      <div>
        <Label className="text-gray-200">Feedback Questions</Label>
        {feedbackQuestions.map((q, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <Select
              value={q.type}
              onValueChange={(value) => handleQuestionChange(index, 'type', value)}
            >
              <SelectTrigger className="w-[180px] bg-gray-700 text-gray-100 border-gray-600">
                <SelectValue placeholder="Question Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                <SelectItem value="rating">Rating (0-5)</SelectItem>
                <SelectItem value="text">Short Answer</SelectItem>
                <SelectItem value="photo">Photo Upload</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
              className="bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
        ))}
        <Button type="button" onClick={handleAddQuestion} variant="outline" className="mt-2 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900">
          Add Question
        </Button>
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Add Service</Button>
    </form>
  )
}

function ServiceDetails({ service, feedbacks, onBack, onReward }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [filterRating, setFilterRating] = useState('all')
  const [viewMode, setViewMode] = useState('individual')
  const itemsPerPage = 5

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === 'rating') {
      return b.overallRating - a.overallRating
    }
    return 0
  })

  const filteredFeedbacks = sortedFeedbacks.filter(feedback => {
    if (filterRating === 'all') return true
    return feedback.overallRating === parseInt(filterRating)
  })

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)
  const  paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const averageRating = feedbacks.reduce((sum, feedback) => sum + feedback.overallRating, 0) / feedbacks.length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-blue-400">{service.name}</h2>
        <Button onClick={onBack} variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Services
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-400">Service Statistics</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Interactions:</span>
                <span className="font-semibold">{service.interactions}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Feedbacks:</span>
                <span className="font-semibold">{service.feedbacks}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-semibold flex items-center">
                  {averageRating.toFixed(1)}
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-current" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-400">Feedback Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-gray-300">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-[180px] bg-gray-700 text-gray-100 border-gray-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="filter" className="text-gray-300">Filter by rating:</Label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger id="filter" className="w-[180px] bg-gray-700 text-gray-100 border-gray-600">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="viewMode" className="text-gray-300">View Mode:</Label>
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger id="viewMode" className="w-[180px] bg-gray-700 text-gray-100 border-gray-600">
                    <SelectValue placeholder="View Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                    <SelectItem value="individual">Individual Feedbacks</SelectItem>
                    <SelectItem value="aggregated">Aggregated View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {viewMode === 'individual' ? (
              <IndividualFeedbackView
                feedbacks={paginatedFeedbacks}
                onReward={onReward}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <AggregatedFeedbackView feedbacks={feedbacks} />
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-blue-400">Service Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
                <Bar dataKey="interactions" fill="#3B82F6" />
                <Bar dataKey="feedbacks" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IndividualFeedbackView({ feedbacks, onReward, currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">Feedback ID: {feedback.id}</span>
            <span className="text-sm text-gray-400">{feedback.date}</span>
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-blue-400 flex items-center">
              Overall Rating: {feedback.overallRating}
              <Star className="h-5 w-5 ml-1 text-yellow-400 fill-current" />
            </span>
          </div>
          <div className="space-y-3">
            {feedback.responses.map((response, index) => (
              <div key={index} className="bg-gray-800 rounded p-3">
                <p className="text-gray-300 font-medium mb-1">{response.question}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">{response.answer}</p>
                  <div className="flex items-center">
                    {response.rating >= 4 ? (
                      <ThumbsUp className="h-4 w-4 text-green-400 mr-1" />
                    ) : response.rating <= 2 ? (
                      <ThumbsDown className="h-4 w-4 text-red-400 mr-1" />
                    ) : null}
                    <span className="text-sm font-semibold text-gray-300">{response.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => onReward(feedback.id)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Gift className="mr-2 h-4 w-4" /> Reward
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
        >
          Previous
        </Button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function AggregatedFeedbackView({ feedbacks }) {
  const aggregatedResponses = feedbacks[0].responses.map(response => ({
    question: response.question,
    answers: feedbacks.map(feedback => 
      feedback.responses.find(r => r.question === response.question)
    )
  }))

  return (
    <div className="space-y-6">
      {aggregatedResponses.map((aggregatedResponse, index) => (
        <Card key={index} className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-blue-400">{aggregatedResponse.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aggregatedResponse.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="bg-gray-800 rounded p-3 flex justify-between items-center">
                  <p className="text-gray-300">{answer.answer}</p>
                  <div className="flex items-center">
                    {answer.rating >= 4 ? (
                      <ThumbsUp className="h-4 w-4 text-green-400 mr-1" />
                    ) : answer.rating <= 2 ? (
                      <ThumbsDown className="h-4 w-4 text-red-400 mr-1" />
                    ) : null}
                    <span className="text-sm font-semibold text-gray-300">{answer.rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}