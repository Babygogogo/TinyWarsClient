
--[[--------------------------------------------------------------------------------
-- ModelUnitForOnline是战场上的一个作战单位。
--
-- 主要职责和使用场景举例：
--   构造作战单位，维护相关数值，提供接口给外界访问
--
-- 其他：
--   - ModelUnitForOnline中的许多概念都和ModelTile很相似，包括tiledID、instantialData、构造过程等，因此可以参照ModelTile的注释，这里不赘述。
--     有点不同的是，ModelUnitForOnline只需一个tiledID即可构造，而ModelTile可能需要1-2个。
--]]--------------------------------------------------------------------------------

local ModelUnitForOnline = requireFW("src.global.functions.class")("ModelUnitForOnline")

local Destroyers            = requireFW("src.app.utilities.Destroyers")
local GameConstantFunctions = requireFW("src.app.utilities.GameConstantFunctions")
local GridIndexFunctions    = requireFW("src.app.utilities.GridIndexFunctions")
local LocalizationFunctions = requireFW("src.app.utilities.LocalizationFunctions")
local SingletonGetters      = requireFW("src.app.utilities.SingletonGetters")
local ComponentManager      = requireFW("src.global.components.ComponentManager")

local assert = assert

local UNIT_STATE_CODE = {
    Idle     = 1,
    Actioned = 2,
}

--------------------------------------------------------------------------------
-- The functions that loads the data for the model from a TiledID/lua table.
--------------------------------------------------------------------------------
local function initWithTiledID(self, tiledID)
    self.m_TiledID = tiledID

    local template = GameConstantFunctions.getTemplateModelUnitWithTiledId(tiledID)
    assert(template, "ModelUnitForOnline-initWithTiledID() failed to get the template model unit with param tiledID." .. tiledID)

    if (template ~= self.m_Template) then
        self.m_Template  = template
        self.m_StateCode = UNIT_STATE_CODE.Idle

        ComponentManager.unbindAllComponents(self)
        for name, data in pairs(template) do
            if (string.byte(name) > string.byte("z")) or (string.byte(name) < string.byte("a")) then
                ComponentManager.bindComponent(self, name, {template = data, instantialData = data})
            end
        end
    end
end

local function loadInstantialData(self, param)
    self.m_StateCode = param.stateCode or self.m_StateCode
    self.m_UnitID    = param.unitID    or self.m_UnitID

    for name, data in pairs(param) do
        if (string.byte(name) > string.byte("z")) or (string.byte(name) < string.byte("a")) then
            ComponentManager.getComponent(self, name):loadInstantialData(data)
        end
    end
end

--------------------------------------------------------------------------------
-- The constructor and initializers.
--------------------------------------------------------------------------------
function ModelUnitForOnline:ctor(param)
    initWithTiledID(   self, param.tiledID)
    loadInstantialData(self, param)

    if (self.m_View) then
        self:initView()
    end

    return self
end

function ModelUnitForOnline:initView()
    local view = self.m_View
    assert(view, "ModelUnitForOnline:initView() no view is attached to the actor of the model.")

    self:setViewPositionWithGridIndex()

    return self
end

--------------------------------------------------------------------------------
-- The function for serialization.
--------------------------------------------------------------------------------
function ModelUnitForOnline:toSerializableTable()
    local t = {}
    for name, component in pairs(ComponentManager.getAllComponents(self)) do
        if (component.toSerializableTable) then
            t[name] = component:toSerializableTable()
        end
    end

    t.tiledID = self:getTiledId()
    t.unitID  = self:getUnitId()
    local stateCode = self.m_StateCode
    if (stateCode ~= UNIT_STATE_CODE.Idle) then
        t.stateCode = stateCode
    end

    return t
end

--------------------------------------------------------------------------------
-- The callback functions on start running/script events.
--------------------------------------------------------------------------------
function ModelUnitForOnline:onStartRunning(modelWar)
    self.m_ModelWar  = modelWar
    self.m_TeamIndex = SingletonGetters.getModelPlayerManager(modelWar):getModelPlayer(self:getPlayerIndex()):getTeamIndex()

    ComponentManager.callMethodForAllComponents(self, "onStartRunning", modelWar)
    self:updateView()

    return self
end

--------------------------------------------------------------------------------
-- The public functions.
--------------------------------------------------------------------------------
function ModelUnitForOnline:moveViewAlongPath(path, isDiving, callbackAfterMove)
    if (self.m_View) then
        self.m_View:moveAlongPath(path, isDiving, callbackAfterMove)
    elseif (callbackAfterMove) then
        callbackAfterMove()
    end

    return self
end

function ModelUnitForOnline:moveViewAlongPathAndFocusOnTarget(path, isDiving, targetGridIndex, callbackAfterMove)
    if (self.m_View) then
        self.m_View:moveAlongPathAndFocusOnTarget(path, isDiving, targetGridIndex, callbackAfterMove)
    elseif (callbackAfterMove) then
        callbackAfterMove()
    end

    return self
end

function ModelUnitForOnline:setViewVisible(visible)
    if (self.m_View) then
        self.m_View:setVisible(visible)
    end

    return self
end

function ModelUnitForOnline:updateView()
    if (self.m_View) then
        self.m_View:updateWithModelUnit(self)
    end

    return self
end

function ModelUnitForOnline:removeViewFromParent()
    if (self.m_View) then
        self.m_View:removeFromParent()
        self.m_View = nil
    end

    return self
end

function ModelUnitForOnline:showNormalAnimation()
    if (self.m_View) then
        self.m_View:showNormalAnimation()
    end

    return self
end

function ModelUnitForOnline:showMovingAnimation()
    if (self.m_View) then
        self.m_View:showMovingAnimation()
    end

    return self
end

function ModelUnitForOnline:getModelWar()
    assert(self.m_ModelWar, "ModelUnitForOnline:getModelWar() onStartRunning() hasn't been called yet.")
    return self.m_ModelWar
end

function ModelUnitForOnline:getTiledId()
    return self.m_TiledID
end

function ModelUnitForOnline:getUnitId()
    return self.m_UnitID
end

function ModelUnitForOnline:getPlayerIndex()
    return GameConstantFunctions.getPlayerIndexWithTiledId(self.m_TiledID)
end

function ModelUnitForOnline:getTeamIndex()
    assert(self.m_TeamIndex, "ModelUnitForOnline:getTeamIndex() the index hasn't been initialized yet.")
    return self.m_TeamIndex
end

function ModelUnitForOnline:isStateIdle()
    return self.m_StateCode == UNIT_STATE_CODE.Idle
end

function ModelUnitForOnline:setStateIdle()
    self.m_StateCode = UNIT_STATE_CODE.Idle

    return self
end

function ModelUnitForOnline:setStateActioned()
    self.m_StateCode = UNIT_STATE_CODE.Actioned

    return self
end

function ModelUnitForOnline:getUnitType()
    return GameConstantFunctions.getUnitTypeWithTiledId(self:getTiledId())
end

function ModelUnitForOnline:getDescription()
    return LocalizationFunctions.getLocalizedText(114, self:getUnitType())
end

function ModelUnitForOnline:getUnitTypeFullName()
    return LocalizationFunctions.getLocalizedText(113, self:getUnitType())
end

return ModelUnitForOnline
